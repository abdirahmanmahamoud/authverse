import chalk from "chalk";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GenerateSecret } from "../utils/GenerateSecret.js";
import { packageManager } from "../utils/packageManager.js";
import { authUiTanstackState } from "./authUiTanstackState.js";

interface drizzleRunTanstackStartProps {
  authUi: boolean;
  cmd: boolean;
}

export const drizzleRunTanstackStart = async ({
  authUi,
  cmd,
}: drizzleRunTanstackStartProps) => {
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

    // Create db folder
    const dbTemplatePath = path.resolve(__dirname, "./template/db");
    const dbDir = path.join(projectDir, "db");

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Copy drizzle.ts
    const dbDestinationPath = path.join(dbDir, "drizzle.ts");
    fs.copyFileSync(`${dbTemplatePath}/drizzle.ts`, dbDestinationPath);

    // Copy drizzle schema.ts
    const schemaDestinationPath = path.join(dbDir, "schema.ts");
    fs.copyFileSync(`${dbTemplatePath}/schema.ts`, schemaDestinationPath);

    // Copy drizzle config file
    const drizzleConfigTemplatePath = path.resolve(
      __dirname,
      "./template/config/drizzle.config.ts",
    );
    const drizzleConfigDestinationPath = path.join(
      projectDir,
      "drizzle.config.ts",
    );
    fs.copyFileSync(drizzleConfigTemplatePath, drizzleConfigDestinationPath);

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
      });
    } else {
      console.log(
        chalk.green(
          "\nDrizzle setup completed successfully and better-auth installed\n",
        ),
      );
    }
  } catch (err) {
    console.error(chalk.red("Drizzle setup failed:"), err);
  }
};
