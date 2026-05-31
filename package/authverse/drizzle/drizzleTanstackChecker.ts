import chalk from "chalk";
import { drizzleProps } from "../script/drizzleRun.js";
import path from "path";
import fs from "fs";
import { drizzleTanstackSetup } from "./drizzleTanstackSetup.js";
import { fileURLToPath } from "url";
import {
  addMissingColumnsToTable,
  extractColumnNames,
  extractTableDefinition,
} from "./drizzle-utils.js";
import { packageManager } from "../utils/packageManager.js";
import { GenerateSecret } from "../utils/GenerateSecret.js";
import { authUiTanstackState } from "../script/authUiTanstackState.js";

interface Props extends drizzleProps {
  projectDir: string;
}

export const drizzleTanstackChecker = async ({
  authUi,
  cmd,
  projectDir,
}: Props) => {
  try {
    const drizzleConfigPath = path.join(projectDir, "drizzle.config.ts");

    if (!fs.existsSync(drizzleConfigPath)) {
      return await drizzleTanstackSetup({ authUi, cmd, projectDir });
    }

    const drizzleConfigContent = fs.readFileSync(drizzleConfigPath, "utf-8");

    const schemaMatch = drizzleConfigContent.match(/schema:\s*["'`](.*?)["'`]/);
    const schemaPath = schemaMatch ? schemaMatch[1] : null;

    if (!schemaPath || schemaPath === "") {
      return await drizzleTanstackSetup({ authUi, cmd, projectDir });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbTemplatePath = path.resolve(__dirname, "./template/db/schema.ts");

    const schemaFilePath = path.join(projectDir, schemaPath);

    if (!fs.existsSync(schemaFilePath)) {
      const dbFolder = path.dirname(schemaFilePath);
      if (!fs.existsSync(dbFolder)) {
        fs.mkdirSync(dbFolder, { recursive: true });
      }
      fs.copyFileSync(dbTemplatePath, schemaFilePath);
    } else {
      let schemaFileContent = fs.readFileSync(schemaFilePath, "utf-8");
      const dbTemplateContent = fs.readFileSync(dbTemplatePath, "utf-8");

      const requiredTables = ["user", "session", "account", "verification"];

      let needsUpdate = false;
      let updatedSchemaContent = schemaFileContent;

      // Check and update each table
      for (const table of requiredTables) {
        const existingTable = extractTableDefinition(
          updatedSchemaContent,
          table,
        );
        const templateTable = extractTableDefinition(dbTemplateContent, table);

        if (!existingTable && templateTable) {
          // Add missing table
          // Add table definition before schema export or at the end
          const schemaExportIndex = updatedSchemaContent.indexOf(
            "export const schema =",
          );
          if (schemaExportIndex !== -1) {
            updatedSchemaContent =
              updatedSchemaContent.slice(0, schemaExportIndex) +
              templateTable +
              "\n\n" +
              updatedSchemaContent.slice(schemaExportIndex);
          } else {
            updatedSchemaContent += "\n\n" + templateTable;
          }
          needsUpdate = true;
        } else if (existingTable && templateTable) {
          // Check and add missing columns
          const existingColumns = extractColumnNames(existingTable);
          const templateColumns = extractColumnNames(templateTable);
          const missingColumns = templateColumns.filter(
            (col) => !existingColumns.includes(col),
          );

          if (missingColumns.length > 0) {
            const updatedTable = addMissingColumnsToTable(
              existingTable,
              templateTable,
            );
            updatedSchemaContent = updatedSchemaContent.replace(
              existingTable,
              updatedTable,
            );
            needsUpdate = true;
          }
        }
      }

      // Update schema export object
      if (needsUpdate) {
        const schemaExportRegex = /export const schema = \{([\s\S]*?)\};/;
        const schemaMatch = updatedSchemaContent.match(schemaExportRegex);

        if (schemaMatch) {
          let currentSchemaContent = schemaMatch[1];

          for (const table of requiredTables) {
            if (!currentSchemaContent.includes(`${table},`)) {
              const lines = currentSchemaContent.split("\n");
              const lastNonEmptyLine = lines.length - 1;
              if (lines[lastNonEmptyLine].trim() === "}") {
                lines[lastNonEmptyLine] =
                  `  ${table},\n${lines[lastNonEmptyLine]}`;
              } else {
                lines.push(`  ${table},`);
              }
              currentSchemaContent = lines.join("\n");
            }
          }

          updatedSchemaContent = updatedSchemaContent.replace(
            schemaExportRegex,
            `export const schema = {${currentSchemaContent}};`,
          );
        }

        // Write updated schema
        fs.writeFileSync(schemaFilePath, updatedSchemaContent);
      }
    }

    // read package json
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // Check if better auth is already installed
    if (!packageJson.dependencies["better-auth"]) {
      console.log(chalk.cyan("\n⚙️  Initializing better auth...\n"));
      packageManager("better-auth");
    }

    const drizzleDeps = [
      "drizzle-orm",
      "@neondatabase/serverless",
      "dotenv",
      "drizzle-kit",
    ];

    const missingDrizzleDeps = drizzleDeps.filter((dep) => {
      return (
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
    });

    if (missingDrizzleDeps.length > 0) {
      console.log(chalk.cyan("\n⚙️  Initializing drizzle...\n"));

      // install drizzle
      packageManager(missingDrizzleDeps.join(" "));
    }

    // Create .env file
    const envPath = path.join(projectDir, ".env");

    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, "DATABASE_URL=\n");
    }

    // Generate better auth secret
    const secret = await GenerateSecret();

    // Read .env content
    const envContent = fs.readFileSync(envPath, "utf-8");

    // .env file add better auth secret
    if (!envContent.includes("BETTER_AUTH_SECRET")) {
      fs.appendFileSync(envPath, `\n\nBETTER_AUTH_SECRET=${secret}`);
    }
    if (!envContent.includes("BETTER_AUTH_URL")) {
      fs.appendFileSync(envPath, `\nBETTER_AUTH_URL=http://localhost:3000\n`);
    }

    // src folder
    const srcPath = path.join(projectDir, "src");

    // check exists lib
    const libPath = path.join(srcPath, "lib");
    if (!fs.existsSync(libPath)) {
      // create lib folder
      fs.mkdirSync(libPath, { recursive: true });
    }

    // Copy auth.ts
    const authTemplatePath = path.resolve(
      __dirname,
      "./template/TanstackStart/lib/auth-drizzle.ts",
    );
    const authDestinationPath = path.join(libPath, "auth.ts");
    fs.copyFileSync(authTemplatePath, authDestinationPath);

    // Copy auth-client.ts
    const authClientTemplatePath = path.resolve(
      __dirname,
      "./template/lib/auth-client.ts",
    );
    const authClientDestinationPath = path.join(libPath, "auth-client.ts");
    fs.copyFileSync(authClientTemplatePath, authClientDestinationPath);

    // check exists middleware
    const middlewarePath = path.join(srcPath, "middleware");

    if (!fs.existsSync(middlewarePath)) {
      //  create middleware folder
      fs.mkdirSync(middlewarePath, { recursive: true });
    }

    // Copy auth.ts
    const authMiddlewareTemplatePath = path.resolve(
      __dirname,
      `./template/TanstackStart/middleware/auth.ts`,
    );
    const authMiddlewareDestinationPath = path.join(middlewarePath, "auth.ts");
    fs.copyFileSync(authMiddlewareTemplatePath, authMiddlewareDestinationPath);

    // create file routes/api/auth/$.ts
    const fileRouteTemplatePath = path.resolve(
      __dirname,
      `./template/TanstackStart/routes/$.ts`,
    );
    const fileRouteDestinationPath = path.join(
      srcPath,
      "routes",
      "api",
      "auth",
    );

    if (!fs.existsSync(fileRouteDestinationPath)) {
      fs.mkdirSync(fileRouteDestinationPath, { recursive: true });
    }

    const apiDestinationPath = path.join(fileRouteDestinationPath, "$.ts");
    fs.copyFileSync(fileRouteTemplatePath, apiDestinationPath);

    if (authUi) {
      await authUiTanstackState({
        packageJson: packageJson,
        cmd: cmd,
        database: "drizzle",
      });
    } else {
      console.log(chalk.green("\nCompleted installation successfully"));
      console.log(chalk.cyan("\nInstall Package:"));
      console.log(chalk.white(`• drizzle schema\n• better-auth`));
      console.log(chalk.cyan("\nFiles created:"));
      console.log(
        chalk.white(
          `• src/lib/auth.ts\n• src/lib/auth-client.ts\n• src/app/api/auth/[...all]/route.ts\n• src/proxy.ts\n`,
        ),
      );
    }
  } catch (error) {
    console.log(chalk.red("Failed to setup drizzle ", error));
  }
};
