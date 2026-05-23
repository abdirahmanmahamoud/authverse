import path from "path";
import type { drizzleProps } from "../script/drizzleRun.js";
import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from "url";
import { drizzleNextSetup } from "./drizzleNextSetup.js";
import { CreateFolder } from "../utils/CreateFolder.js";
import { authUiRun } from "../script/authUi.js";
import inquirer from "inquirer";
import { GenerateSecret } from "../utils/GenerateSecret.js";

interface drizzleNextSetupProps extends drizzleProps {
  projectDir: string;
}

// Helper function to extract column names from table definition
const extractColumnNames = (tableDef: string): string[] => {
  const columns: string[] = [];
  const lines = tableDef.split("\n");

  for (const line of lines) {
    const columnMatch = line.match(/^\s*(\w+):/);
    if (columnMatch && !line.includes("//") && !line.includes("export const")) {
      columns.push(columnMatch[1]);
    }
  }
  return columns;
};

// Helper function to extract table definition from content
const extractTableDefinition = (
  content: string,
  tableName: string,
): string | null => {
  const tableRegex = new RegExp(
    `export const ${tableName} = pgTable\\(["']${tableName}["'][\\s\\S]*?\\n\\}\\);`,
    "m",
  );
  const match = content.match(tableRegex);
  return match ? match[0] : null;
};

// Helper function to add missing columns to table definition
const addMissingColumnsToTable = (
  existingTableDef: string,
  templateTableDef: string,
): string => {
  const existingColumns = extractColumnNames(existingTableDef);
  const templateColumns = extractColumnNames(templateTableDef);

  const missingColumns = templateColumns.filter(
    (col) => !existingColumns.includes(col),
  );

  if (missingColumns.length === 0) {
    return existingTableDef;
  }

  // Extract column definitions from template
  const lines = templateTableDef.split("\n");
  const columnDefinitions: string[] = [];

  for (const line of lines) {
    for (const col of missingColumns) {
      if (line.trim().startsWith(`${col}:`)) {
        columnDefinitions.push(line);
        break;
      }
    }
  }

  // Insert missing columns into existing table definition
  const existingLines = existingTableDef.split("\n");
  const insertPosition = existingLines.length - 1; // Before the closing brace

  for (const colDef of columnDefinitions) {
    existingLines.splice(insertPosition, 0, `  ${colDef.trim()}`);
  }

  return existingLines.join("\n");
};

export const drizzleNextChecker = async ({
  authUi,
  cmd,
  projectDir,
}: drizzleNextSetupProps) => {
  try {
    const drizzleConfigPath = path.join(projectDir, "drizzle.config.ts");

    if (!fs.existsSync(drizzleConfigPath)) {
      return await drizzleNextSetup({ authUi, cmd, projectDir });
    }

    const drizzleConfigContent = fs.readFileSync(drizzleConfigPath, "utf-8");

    const schemaMatch = drizzleConfigContent.match(/schema:\s*["'`](.*?)["'`]/);
    const schemaPath = schemaMatch ? schemaMatch[1] : null;

    if (!schemaPath || schemaPath === "") {
      return await drizzleNextSetup({ authUi, cmd, projectDir });
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

    // Check Next.js folder structure src
    const srcFolder = fs.existsSync(path.join(projectDir, "src")) ? "src" : "";

    // check exists lib
    const libPath = path.join(projectDir, srcFolder, "lib");
    if (!fs.existsSync(libPath)) {
      fs.mkdirSync(libPath, { recursive: true });
    }

    // Check exists lib/auth.ts or auth-client.ts
    const authPath = path.join(libPath, "auth.ts");
    const authClientPath = path.join(libPath, "auth-client.ts");
    if (fs.existsSync(authPath) || fs.existsSync(authClientPath)) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message:
            "Do you want to overwrite existing auth lib/auth.ts or lib/auth-client.ts",
          default: false,
        },
      ]);

      if (answers.overwrite) {
        // Copy auth.ts
        const authTemplatePath = path.resolve(
          __dirname,
          "./template/lib/auth-drizzle.ts",
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
      }
    } else {
      // Copy auth.ts
      const authTemplatePath = path.resolve(
        __dirname,
        "./template/lib/auth-drizzle.ts",
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
    }

    // Create app/api/auth/[...all]/route.ts - FIXED SECTION
    const routeTemplatePath = path.resolve(
      __dirname,
      "./template/api/route.ts",
    );
    // Create the nested directory structure first
    const routeDestinationDir = path.join(
      projectDir,
      srcFolder,
      "app",
      "api",
      "auth",
      "[...all]",
    );

    // Ensure the directory exists before copying the file
    if (!fs.existsSync(routeDestinationDir)) {
      fs.mkdirSync(routeDestinationDir, { recursive: true });
    }

    const routeDestinationPath = path.join(routeDestinationDir, "route.ts");
    fs.copyFileSync(routeTemplatePath, routeDestinationPath);

    // Copy proxy.ts
    const proxyTemplatePath = path.resolve(
      __dirname,
      "./template/proxy/proxy.ts",
    );
    const proxyDestinationDir = path.join(projectDir, srcFolder);
    const proxyDestinationPath = path.join(proxyDestinationDir, "proxy.ts");
    fs.copyFileSync(proxyTemplatePath, proxyDestinationPath);

    if (authUi) {
      await authUiRun({
        folder: srcFolder,
        packageJson: projectDir,
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
          `${CreateFolder({ srcFolder: srcFolder, destFolder: "lib/auth.ts" })}\n${CreateFolder({ srcFolder: srcFolder, destFolder: "lib/auth-client.ts" })}\n${CreateFolder({ srcFolder: srcFolder, destFolder: "app/api/auth/[...all]/route.ts" })}\n${CreateFolder({ srcFolder: srcFolder, destFolder: "proxy.ts" })}\n`,
        ),
      );
    }
  } catch (error: any) {
    console.error(chalk.red("Error checking Drizzle setup:"), error);
  }
};
