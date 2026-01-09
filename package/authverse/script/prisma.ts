import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { GenerateSecret } from "../utils/GenerateSecret.js";
import { authUiRun } from "./authUi.js";
import { packageManager, runCommand } from "../utils/packageManager.js";
import inquirer from "inquirer";

interface prismaRunProps {
  authUi: boolean;
  database: "Postgresql" | "Mongodb" | "Mysql";
}

export const prismaRun = async ({ authUi, database }: prismaRunProps) => {
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
      !packageJson.devDependencies?.prisma &&
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
        `./template/prisma/${database}/schema.prisma`
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
          `./template/config/prisma.config.ts`
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
        !schemaContent.includes("User") &&
        !schemaContent.includes("Session") &&
        !schemaContent.includes("Account") &&
        !schemaContent.includes("Verification")
      ) {
        // Template path
        const templatePath = path.resolve(
          __dirname,
          `./template/prisma/${database}/schema.prisma_copy`
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

    // Check Next.js folder structure src
    const srcFolder = fs.existsSync(path.join(projectDir, "src")) ? "src" : "";

    // check exists lib
    const libPath = path.join(projectDir, srcFolder, "lib");
    if (!fs.existsSync(libPath)) {
      // create lib folder
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
          `./template/lib/${database}/auth.ts`
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

        if (srcFolder === "src") {
          // context auth.ts update import prisma client
          const authContextPath = path.join(libPath, "auth.ts");
          const authContextContent = fs.readFileSync(authContextPath, "utf-8");
          fs.writeFileSync(
            authContextPath,
            authContextContent.replace(
              'import { PrismaClient } from "@/generated/prisma/client";',
              'import { PrismaClient } from "../../generated/prisma/client";'
            )
          );
        }
      }
    } else {
      // Copy auth.ts
      const authTemplatePath = path.resolve(
        __dirname,
        `./template/lib/${database}/auth.ts`
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

      if (srcFolder === "src") {
        // context auth.ts update import prisma client
        const authContextPath = path.join(libPath, "auth.ts");
        const authContextContent = fs.readFileSync(authContextPath, "utf-8");
        fs.writeFileSync(
          authContextPath,
          authContextContent.replace(
            'import { PrismaClient } from "@/generated/prisma/client";',
            'import { PrismaClient } from "../../generated/prisma/client";'
          )
        );
      }
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

    // update path .gitignore prisma generated
    const gitignorePath = path.join(projectDir, ".gitignore");
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");

    if (srcFolder === "src") {
      fs.writeFileSync(
        gitignorePath,
        gitignoreContent.replace("/src/generated/prisma", "/generated")
      );
    } else {
      fs.writeFileSync(
        gitignorePath,
        gitignoreContent.replace("generated/prisma", "/generated")
      );
    }
    if (authUi) {
      await authUiRun({ folder: srcFolder });
    } else {
      console.log(
        chalk.green(
          "\nPrisma setup completed successfully and better-auth installed\n"
        )
      );
    }
  } catch (err) {
    console.error(chalk.red("Prisma setup failed:"), err);
  }
};
