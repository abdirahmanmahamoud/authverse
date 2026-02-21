import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const AppleTanstackStart = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const projectDir = process.cwd();

    // detect src folder
    const srcPath = path.join(projectDir, "src");

    const authFilePath = path.join(srcPath, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("auth.ts file not found"));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    if (!content.includes("betterAuth({")) {
      console.log(chalk.red("betterAuth({}) block not found"));
      return;
    }

    // prevent duplicate
    if (content.includes("socialProviders") && content.includes("apple:")) {
      console.log(chalk.yellow("Apple provider already exists"));
      return;
    }

    // UPDATE 1: Added appBundleIdentifier for native iOS support
    const appleProviderEntry = `
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      // Important for native iOS: Use the app's bundle ID here, not the service ID
      appBundleIdentifier: process.env.APPLE_BUNDLE_ID,
    },`;

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
        // UPDATE 2: Fixed typo in error message
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

    // Add appleid.apple.com to trustedOrigins
    if (content.includes("trustedOrigins: [")) {
      if (!content.includes("https://appleid.apple.com")) {
        content = content.replace(
          "trustedOrigins: [",
          'trustedOrigins: ["https://appleid.apple.com", ',
        );
      }
    } else {
      // Add trustedOrigins after socialProviders or database
      const betterAuthMatch = content.match(/betterAuth\(\{/);
      if (betterAuthMatch) {
        const insertPos = betterAuthMatch.index! + betterAuthMatch[0].length;
        content =
          content.slice(0, insertPos) +
          '\n  trustedOrigins: ["https://appleid.apple.com"],' +
          content.slice(insertPos);
      }
    }

    fs.writeFileSync(authFilePath, content, "utf8");

    // UPDATE 3: Updated .env to include APPLE_BUNDLE_ID
    const envPath = path.join(projectDir, ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      if (!envContent.includes("APPLE_CLIENT_ID")) {
        fs.appendFileSync(
          envPath,
          `\n\n# Apple OAuth\nAPPLE_CLIENT_ID=\nAPPLE_CLIENT_SECRET=\nAPPLE_BUNDLE_ID=\n`,
        );
      }
    }

    // Copy AppleOAuthButton.tsx
    const componentTemplate = path.resolve(
      __dirname,
      "./template/TanstackStart/components/AppleOAuthButton.tsx",
    );

    const componentsDir = path.join(srcPath, "components", "authverse");

    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    const componentDest = path.join(componentsDir, "AppleOAuthButton.tsx");

    if (fs.existsSync(componentTemplate)) {
      fs.copyFileSync(componentTemplate, componentDest);
    }

    console.log(chalk.green("Apple provider added & merged successfully"));
  } catch (error) {
    console.log(chalk.red("apple tanstack state error:"), error);
  }
};
