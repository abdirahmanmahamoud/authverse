import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const githubRun = async () => {
  try {
    // Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Detect project structure
    const projectDir = process.cwd();

    // Check Next.js folder structure src
    const srcPath = path.join(projectDir, "src");
    const folder = fs.existsSync(srcPath) ? "src" : "";

    // Locate auth.ts file
    const authFilePath = path.join(projectDir, folder, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("auth.ts file not found."));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    // githubProviderCode code
    const githubProviderCode = `github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },`;

    // Find where to insert (inside betterAuth config)
    if (content.includes("betterAuth({")) {
      // Check if socialProviders already exists
      if (content.includes("socialProviders:")) {
        // Find the position to insert after the last provider in socialProviders
        const socialProvidersStart = content.indexOf("socialProviders: {");
        let socialProvidersEnd = socialProvidersStart;
        let braceCount = 0;
        let inSocialProviders = false;

        // Find the closing brace of socialProviders object
        for (let i = socialProvidersStart; i < content.length; i++) {
          if (content[i] === "{") {
            braceCount++;
            inSocialProviders = true;
          } else if (content[i] === "}") {
            braceCount--;
            if (inSocialProviders && braceCount === 0) {
              socialProvidersEnd = i;
              break;
            }
          }
        }

        // Insert github provider before the closing brace of socialProviders
        const before = content.substring(0, socialProvidersEnd);
        const after = content.substring(socialProvidersEnd);
        content = before + `${githubProviderCode} \n` + after;
      } else {
        // Create new socialProviders section - insert before plugins or other top-level properties
        const insertPosition = content.search(
          /(?=,\s*(plugins|emailAndPassword|session|database|$|\n\s*\}\)))/
        );
        if (insertPosition !== -1) {
          const before = content.substring(0, insertPosition);
          const after = content.substring(insertPosition);
          content =
            before +
            `,\n  socialProviders: {\n    ${githubProviderCode}\n  }` +
            after;
        }
      }

      fs.writeFileSync(authFilePath, content, "utf8");

      // Add .env variables info
      const envPath = path.join(projectDir, ".env");
      if (fs.existsSync(envPath)) {
        fs.appendFileSync(envPath, `\n\n# Github OAuth Credentials`);
        fs.appendFileSync(envPath, `\nGITHUB_CLIENT_ID=`);
        fs.appendFileSync(envPath, `\nGITHUB_CLIENT_SECRET=`);
      }

      // Add GithubProviders.tsx to components/authverse
      const componentPath = path.resolve(
        __dirname,
        "./template/components/GithubProviders.tsx"
      );

      const destinationPath = path.join(
        projectDir,
        folder,
        "components",
        "authverse"
      );

      // Ensure the directory exists before copying the file
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      const LoginDestinationPath = path.join(
        destinationPath,
        "GithubProviders.tsx"
      );

      if (fs.existsSync(componentPath)) {
        fs.copyFileSync(componentPath, LoginDestinationPath);
      }

      console.log(
        chalk.green("Added socialProviders with Github provider successfully")
      );
    } else {
      console.log(chalk.red("Could not find betterAuth({ }) block in auth.ts"));
    }
  } catch (error) {
    console.log(chalk.red("Error adding socialProviders:"), error);
  }
};
