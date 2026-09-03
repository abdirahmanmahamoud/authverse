import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CreateFolder } from "../utils/CreateFolder.js";
import { packageManager } from "../utils/packageManager.js";
import {
  APPLE_CLIENT_SECRET_FUNCTION,
  APPLE_ENV_VARS,
  APPLE_IMPORT,
  APPLE_ORIGIN,
  APPLE_PROVIDER_ENTRY,
} from "./appleConfig.js";

export const AppleNext = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const projectDir = process.cwd();

    // detect src folder
    const srcPath = path.join(projectDir, "src");
    const folder = fs.existsSync(srcPath) ? "src" : "";

    const authFilePath = path.join(projectDir, folder, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("No Configured Better Auth file found"));
      console.log(chalk.cyan("Run authverse init to initialize better auth"));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    if (!content.includes("betterAuth({")) {
      console.log(chalk.red("betterAuth({}) block not found"));
      console.log(chalk.cyan("Run authverse init to initialize better auth"));
      return;
    }

    // prevent duplicate
    if (content.includes("socialProviders") && content.includes("apple:")) {
      console.log(chalk.yellow("Apple provider already exists"));
      return;
    }

    // Inject jose import + Apple client secret generator at the top of the file
    const preamble =
      (content.includes('from "jose"') ? "" : APPLE_IMPORT) +
      "\n" +
      APPLE_CLIENT_SECRET_FUNCTION +
      "\n";
    content = preamble + content;

    const appleProviderEntry = APPLE_PROVIDER_ENTRY;

    // CASE 1: socialProviders already exists → merge
    if (content.includes("socialProviders: {")) {
      const start = content.indexOf("socialProviders: {");
      let braceCount = 0;
      let insertPos = -1;

      for (let i = start; i < content.length; i++) {
        if (content[i] === "{") braceCount++;
        if (content[i] === "}") {
          braceCount--;
          if (braceCount === 0) {
            insertPos = i;
            break;
          }
        }
      }

      if (insertPos === -1) {
        console.log(chalk.red("Failed to parse socialProviders block"));
        return;
      }

      content =
        content.slice(0, insertPos) +
        appleProviderEntry +
        "\n  " +
        content.slice(insertPos);
    } else {
      // CASE 2: socialProviders does NOT exist → create after database
      const databaseRegex =
        /database:\s*(prismaAdapter|drizzleAdapter)\([\s\S]*?\),/;

      if (!databaseRegex.test(content)) {
        console.log(
          chalk.red(
            "Could not find database adapter (prismaAdapter or drizzleAdapter)",
          ),
        );
        return;
      }

      const socialProvidersBlock = `
  socialProviders: {
${appleProviderEntry}
  },`;

      content = content.replace(
        databaseRegex,
        (match) => `${match}\n${socialProvidersBlock}`,
      );
    }

    // Add appleid.apple.com to trustedOrigins without removing existing origins
    const trustedOriginsHasApple =
      /trustedOrigins\s*:\s*\[[^\]]*https:\/\/appleid\.apple\.com/.test(
        content,
      );
    if (content.includes("trustedOrigins: [")) {
      if (!trustedOriginsHasApple) {
        content = content.replace(
          "trustedOrigins: [",
          `trustedOrigins: [\"${APPLE_ORIGIN}\", `,
        );
      }
    } else {
      // Add trustedOrigins after the socialProviders/database block
      const authBlockMatch = content.match(/betterAuth\(\{/);
      if (authBlockMatch) {
        const insertPos = authBlockMatch.index! + authBlockMatch[0].length;
        content =
          content.slice(0, insertPos) +
          `\n  trustedOrigins: [\"${APPLE_ORIGIN}\"],` +
          content.slice(insertPos);
      }
    }

    fs.writeFileSync(authFilePath, content, "utf8");

    // .env with the credentials required to generate the Apple client secret JWT
    const envPath = path.join(projectDir, ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      if (!envContent.includes("APPLE_CLIENT_ID")) {
        fs.appendFileSync(envPath, APPLE_ENV_VARS);
      }
    }

    // Install jose for client secret generation
    packageManager("jose");

    // Copy AppleOAuthButton.tsx
    const componentTemplate = path.resolve(
      __dirname,
      "./template/components/AppleOAuthButton.tsx",
    );

    const componentsDir = path.join(
      projectDir,
      folder,
      "components",
      "authverse",
    );

    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    const componentDest = path.join(componentsDir, "AppleOAuthButton.tsx");

    if (fs.existsSync(componentTemplate)) {
      fs.copyFileSync(componentTemplate, componentDest);
    }

    console.log(chalk.green("Apple provider added & merged successfully\n"));
    console.log(
      chalk.white(
        `${CreateFolder({ srcFolder: folder, destFolder: "components/authverse/AppleOAuthButton.tsx" })}\n`,
      ),
    );
  } catch (error) {
    console.log(chalk.red("apple next error:"), error);
  }
};
