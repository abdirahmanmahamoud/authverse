import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { GenerateSecret } from "../function/GenerateSecret.js";
import { authUiRun } from "./authUi.js";

export const drizzleRun = async (authUi: boolean) => {
  try {
    console.log(chalk.cyan("\n⚙️  Initializing better auth and drizzle...\n"));

    // install better auth
    execSync("npm install better-auth", { stdio: "inherit" });

    // install drizzle
    execSync("npm install drizzle-orm @neondatabase/serverless dotenv", {
      stdio: "inherit",
    });
    execSync("npm install -D drizzle-kit", { stdio: "inherit" });

    //  Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Create .env file
    const projectDir = process.cwd();
    const envPath = path.join(projectDir, ".env");

    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, "DATABASE_URL=\n");
    }

    // Generate better auth secret
    const secret = await GenerateSecret();

    // .env file add better auth secret
    fs.appendFileSync(envPath, `\n\nBETTER_AUTH_SECRET=${secret}`);
    fs.appendFileSync(envPath, `\nBETTER_AUTH_URL=http://localhost:3000\n`);

    // Check Next.js folder structure src
    const srcPath = path.join(projectDir, "src");
    const folder = srcPath ? "" : "src";

    // check exists lib
    const libPath = path.join(projectDir, folder, "lib");
    if (!fs.existsSync(libPath)) {
      fs.mkdirSync(libPath, { recursive: true });
    }

    // Copy auth.ts
    const authTemplatePath = path.resolve(
      __dirname,
      "../../template/lib/auth-drizzle.ts"
    );
    const authDestinationPath = path.join(libPath, "auth.ts");
    fs.copyFileSync(authTemplatePath, authDestinationPath);

    // Copy auth-client.ts
    const authClientTemplatePath = path.resolve(
      __dirname,
      "../../template/lib/auth-client.ts"
    );
    const authClientDestinationPath = path.join(libPath, "auth-client.ts");
    fs.copyFileSync(authClientTemplatePath, authClientDestinationPath);

    // Create db folder
    const dbTemplatePath = path.resolve(__dirname, "../../template/db");
    const dbDir = path.join(projectDir, folder, "db");

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
      "../../template/config/drizzle.config.ts"
    );
    const drizzleConfigDestinationPath = path.join(
      projectDir,
      "drizzle.config.ts"
    );
    fs.copyFileSync(drizzleConfigTemplatePath, drizzleConfigDestinationPath);

    // create server folder
    const serverPath = path.join(projectDir, folder, "server");
    if (!fs.existsSync(serverPath)) {
      fs.mkdirSync(serverPath, { recursive: true });
    }

    // Copy user.ts
    const userTemplatePath = path.resolve(
      __dirname,
      "../../template/server/user.ts"
    );
    const userDestinationPath = path.join(serverPath, "user.ts");
    fs.copyFileSync(userTemplatePath, userDestinationPath);

    // Create app/api/auth/[...all]/route.ts - FIXED SECTION
    const routeTemplatePath = path.resolve(
      __dirname,
      "../../template/api/route.ts"
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
      "../../template/proxy/proxy.ts"
    );
    const proxyDestinationDir = path.join(projectDir, folder);
    const proxyDestinationPath = path.join(proxyDestinationDir, "proxy.ts");
    fs.copyFileSync(proxyTemplatePath, proxyDestinationPath);

    if (authUi) {
      await authUiRun({ folder });
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
