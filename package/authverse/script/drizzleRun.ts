import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { GenerateSecret } from "../utils/GenerateSecret.js";
import { authUiRun } from "./authUi.js";
import { packageManager } from "../utils/packageManager.js";
import inquirer from "inquirer";

export const drizzleRun = async (authUi: boolean) => {
  try {
    // Get project directory
    const projectDir = process.cwd();

    // Get package json
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    if (!packageJson.dependencies["better-auth"]) {
      console.log(chalk.cyan("\n⚙️  Initializing better auth...\n"));

      // install better auth
      packageManager("better-auth");
    }

    if (
      !packageJson.dependencies["drizzle-orm"] &&
      !packageJson.dependencies["drizzle-orm"] &&
      !packageJson.dependencies["drizzle-kit"] &&
      !packageJson.devDependencies["drizzle-kit"]
    ) {
      console.log(chalk.cyan("\n⚙️  Initializing drizzle...\n"));

      // install drizzle
      packageManager("drizzle-orm @neondatabase/serverless dotenv");
      packageManager("drizzle-kit", true);
    }

    //  Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

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
          "./template/lib/auth-drizzle.ts"
        );
        const authDestinationPath = path.join(libPath, "auth.ts");
        fs.copyFileSync(authTemplatePath, authDestinationPath);

        // Copy auth-client.ts
        const authClientTemplatePath = path.resolve(
          __dirname,
          "./template/lib/auth-client.ts"
        );
        const authClientDestinationPath = path.join(libPath, "auth-client.ts");
        fs.copyFileSync(authClientTemplatePath, authClientDestinationPath);
      }
    } else {
      // Copy auth.ts
      const authTemplatePath = path.resolve(
        __dirname,
        "./template/lib/auth-drizzle.ts"
      );
      const authDestinationPath = path.join(libPath, "auth.ts");
      fs.copyFileSync(authTemplatePath, authDestinationPath);

      // Copy auth-client.ts
      const authClientTemplatePath = path.resolve(
        __dirname,
        "./template/lib/auth-client.ts"
      );
      const authClientDestinationPath = path.join(libPath, "auth-client.ts");
      fs.copyFileSync(authClientTemplatePath, authClientDestinationPath);
    }
    // Create db folder
    const dbTemplatePath = path.resolve(__dirname, "./template/db");
    const dbDir = path.join(projectDir, srcFolder, "db");

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Check exists db folder lib/drizzle.ts or lib/schema.ts
    const drizzlePath = path.join(projectDir, srcFolder, "/db/drizzle.ts");
    const schemaPath = path.join(projectDir, srcFolder, "/db/schema.ts");

    if (fs.existsSync(drizzlePath) || fs.existsSync(schemaPath)) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message:
            "Your schema or drizzle file already exists. Do you want to overwrite it?",
          default: false,
        },
      ]);
      if (answers.overwrite) {
        const schemaDestinationPath = path.join(dbDir, "schema.ts");
        fs.copyFileSync(`${dbTemplatePath}/schema.ts`, schemaDestinationPath);
      }
    } else {
      // Copy drizzle.ts
      const dbDestinationPath = path.join(dbDir, "drizzle.ts");
      fs.copyFileSync(`${dbTemplatePath}/drizzle.ts`, dbDestinationPath);

      // Copy drizzle schema.ts
      const schemaDestinationPath = path.join(dbDir, "schema.ts");
      fs.copyFileSync(`${dbTemplatePath}/schema.ts`, schemaDestinationPath);
    }

    // Copy drizzle config file
    if (srcFolder == "src") {
      const drizzleConfigTemplatePath = path.resolve(
        __dirname,
        "./template/config/drizzle.config-src.ts"
      );
      const drizzleConfigDestinationPath = path.join(
        projectDir,
        "drizzle.config.ts"
      );
      fs.copyFileSync(drizzleConfigTemplatePath, drizzleConfigDestinationPath);
    } else {
      const drizzleConfigTemplatePath = path.resolve(
        __dirname,
        "./template/config/drizzle.config.ts"
      );
      const drizzleConfigDestinationPath = path.join(
        projectDir,
        "drizzle.config.ts"
      );
      fs.copyFileSync(drizzleConfigTemplatePath, drizzleConfigDestinationPath);
    }
    // create server folder
    const serverPath = path.join(projectDir, srcFolder, "server");
    if (!fs.existsSync(serverPath)) {
      fs.mkdirSync(serverPath, { recursive: true });
    }

    // Copy user.ts
    const userTemplatePath = path.resolve(
      __dirname,
      "./template/server/user.ts"
    );
    const userDestinationPath = path.join(serverPath, "user.ts");
    fs.copyFileSync(userTemplatePath, userDestinationPath);

    // Create app/api/auth/[...all]/route.ts - FIXED SECTION
    const routeTemplatePath = path.resolve(
      __dirname,
      "./template/api/route.ts"
    );
    // Create the nested directory structure first
    const routeDestinationDir = path.join(
      projectDir,
      srcFolder,
      "app",
      "api",
      "auth",
      "[...all]"
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
      "./template/proxy/proxy.ts"
    );
    const proxyDestinationDir = path.join(projectDir, srcFolder);
    const proxyDestinationPath = path.join(proxyDestinationDir, "proxy.ts");
    fs.copyFileSync(proxyTemplatePath, proxyDestinationPath);

    if (authUi) {
      await authUiRun({ folder: srcFolder });
    } else {
      console.log(
        chalk.green(
          "\nDrizzle setup completed successfully and better-auth installed\n"
        )
      );
    }
  } catch (err) {
    console.error(chalk.red("Drizzle setup failed:"), err);
  }
};
