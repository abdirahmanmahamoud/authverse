import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { packageManager, runCommand } from "../utils/packageManager.js";
import { GenerateSecret } from "../utils/GenerateSecret.js";
import { authUiTanstackState } from "./authUiTanstackState.js";

interface prismaRunTanstackStartProps {
  authUi: boolean;
  database: "Postgresql" | "Mongodb" | "Mysql";
  cmd: boolean;
}

export const prismaRunTanstackStart = async ({
  authUi,
  database,
  cmd,
}: prismaRunTanstackStartProps) => {
  try {
    // Get project directory
    const projectDir = process.cwd();

    //  Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Get package json
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // Check install prisma and @prisma/client
    if (
      !packageJson.devDependencies?.prisma ||
      !packageJson.dependencies?.["@prisma/client"]
    ) {
      console.log(chalk.cyan("\n⚙️  Initializing Prisma...\n"));
      // Install prisma + @prisma/client
      if (database !== "Mongodb") {
        packageManager("prisma", true);
        packageManager("@prisma/client");

        if (database === "Mysql") {
          packageManager("@prisma/adapter-mariadb");
        }

        if (database === "Postgresql") {
          packageManager("@prisma/adapter-pg");
        }
      } else if (database === "Mongodb") {
        packageManager("prisma@6.19.0", true);
        packageManager("@prisma/client@6.19.0");
      }
    }

    const prismaDir = path.join(projectDir, "prisma");

    // prisma is not folder
    if (!fs.existsSync(prismaDir)) {
      // Initialize Prisma (creates prisma/schema.prisma)
      console.log(chalk.yellow("\n⚙️  Initializing Prisma...\n"));
      runCommand("prisma init");

      //  Paths
      const templatePath = path.resolve(
        __dirname,
        `./template/prisma/${database}/schema.prisma`,
      );

      //  Ensure prisma folder exists
      if (!fs.existsSync(prismaDir)) {
        fs.mkdirSync(prismaDir, { recursive: true });
      }

      //  Copy schema.prisma
      const destinationPath = path.join(prismaDir, "schema.prisma");
      fs.copyFileSync(templatePath, destinationPath);

      // Copy prisma.config.ts
      if (database === "Mongodb") {
        const prismaConfigPath = path.resolve(
          __dirname,
          `./template/config/prisma.config.ts`,
        );
        const prismaConfigDestinationPath = path.join("", "prisma.config.ts");

        fs.copyFileSync(prismaConfigPath, prismaConfigDestinationPath);
      }
    } else {
      // schema selecy
      const schemaPath = path.join(prismaDir, "schema.prisma");

      // read schema.prisma
      const schemaContent = fs.readFileSync(schemaPath, "utf-8");

      // check if schema.prisma user, session, account, verification
      if (
        !schemaContent.includes("User") ||
        !schemaContent.includes("Session") ||
        !schemaContent.includes("Account") ||
        !schemaContent.includes("Verification")
      ) {
        // Template path
        const templatePath = path.resolve(
          __dirname,
          `./template/prisma/${database}/schema.prisma_copy`,
        );

        // Copy schema.prisma
        fs.appendFileSync(schemaPath, "\n");
        fs.appendFileSync(schemaPath, fs.readFileSync(templatePath));
      }
    }

    // Check install better auth
    if (!packageJson.dependencies?.["better-auth"]) {
      console.log(chalk.yellow("\n⚙️  Initializing better-auth...\n"));
      packageManager("better-auth");
    }

    // Generate better auth secret
    const secret = await GenerateSecret();

    // .env file add better auth secret
    const envPath = path.join(projectDir, ".env");

    // Read .env content
    const envContent = fs.readFileSync(envPath, "utf-8");

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
      `./template/TanstackStart/lib/${database}/auth.ts`,
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
      });
    } else {
      console.log(
        chalk.green(
          "\nPrisma setup completed successfully and better-auth installed\n",
        ),
      );
    }
  } catch (err) {
    console.log(chalk.red("Prisma Run Tanstack State Error: ", err));
  }
};
