import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { GenerateSecret } from "../function/GenerateSecret.js";
import { authUiRun } from "./authUi.js";

interface prismaRunProps {
  authUi: boolean;
  database: "Postgresql" | "Mongodb" | "Mysql";
}

export const prismaRun = async ({ authUi, database }: prismaRunProps) => {
  try {
    console.log(chalk.cyan("\n⚙️  Initializing Prisma...\n"));

    // Install prisma + @prisma/client
    execSync("npm install prisma --save-dev", { stdio: "inherit" });
    execSync("npm install @prisma/client", { stdio: "inherit" });

    if (database === "Mysql") {
      execSync("npm install @prisma/adapter-mariadb", { stdio: "inherit" });
    }

    const projectDir = process.cwd();
    const prismaDir = path.join(projectDir, "prisma");

    // prisma is not folder
    if (!fs.existsSync(prismaDir)) {
      // Initialize Prisma (creates prisma/schema.prisma)
      console.log(chalk.yellow("\n⚙️  Initializing Prisma...\n"));
      execSync("npx prisma init", { stdio: "inherit" });
    }

    //  Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 1 Paths
    const templatePath = path.resolve(
      __dirname,
      `./template/prisma/${database}/schema.prisma`
    );

    // 2 Ensure prisma folder exists
    if (!fs.existsSync(prismaDir)) {
      fs.mkdirSync(prismaDir, { recursive: true });
    }

    // 3 Copy schema.prisma
    const destinationPath = path.join(prismaDir, "schema.prisma");
    fs.copyFileSync(templatePath, destinationPath);

    // install better auth
    console.log(chalk.yellow("\n⚙️  Initializing better-auth...\n"));
    execSync("npm install better-auth", { stdio: "inherit" });

    // Generate better auth secret
    const secret = await GenerateSecret();

    // .env file add better auth secret
    const envPath = path.join(projectDir, ".env");
    fs.appendFileSync(envPath, `\n\nBETTER_AUTH_SECRET=${secret}`);
    fs.appendFileSync(envPath, `\nBETTER_AUTH_URL=http://localhost:3000\n`);

    console.log(chalk.yellow("\n create folder...\n"));

    // Check Next.js folder structure src
    const srcPath = path.join(projectDir, "src");
    const folder = srcPath ? "" : "src";

    // check exists lib
    const libPath = path.join(projectDir, folder, "lib");
    if (!fs.existsSync(libPath)) {
      // create lib folder
      fs.mkdirSync(libPath, { recursive: true });
    }

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

    // create server folder
    const serverPath = path.join(projectDir, folder, "server");
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
    const proxyDestinationDir = path.join(projectDir, folder);
    const proxyDestinationPath = path.join(proxyDestinationDir, "proxy.ts");
    fs.copyFileSync(proxyTemplatePath, proxyDestinationPath);

    if (authUi) {
      await authUiRun({ folder });
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
