import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const googleRun = async () => {
  try {
    execSync("npm install react-icons --save", { stdio: "inherit" });

    // Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Detect project structure
    const projectDir = process.cwd();

    // Check Next.js folder structure src
    const srcPath = path.join(projectDir, "src");
    const folder = srcPath ? "" : "src";

    // Locate auth.ts file
    const authFilePath = path.join(projectDir, folder, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("auth.ts file not found."));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    // SocialProviders code
    const socialProvidersCode = `
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  }`;

    // Find where to insert (inside betterAuth config)
    if (content.includes("betterAuth({")) {
      content = content.replace(/betterAuth\(\{([\s\S]*?)\}\)/, (inner) => {
        // Insert socialProviders block before the last closing brace
        return `\n${inner.trimEnd()},${socialProvidersCode}`;
      });

      fs.writeFileSync(authFilePath, content, "utf8");

      //   add .env variables info
      const envPath = path.join(projectDir, ".env");
      fs.appendFileSync(envPath, `\n\n# Google OAuth Credentials`);
      fs.appendFileSync(envPath, `\nGOOGLE_CLIENT_ID=`);
      fs.appendFileSync(envPath, `\nGOOGLE_CLIENT_SECRET=`);

      const componentPath = path.resolve(
        __dirname,
        "../../template/components/GoogleProviders.tsx"
      );

      // Add GoogleProviders.tsx to components/authverse
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
        "GoogleProviders.tsx"
      );
      fs.copyFileSync(componentPath, LoginDestinationPath);

      console.log(
        chalk.green("Added socialProviders with Google provider successfully")
      );
    } else {
      console.log(chalk.red("Could not find betterAuth({ }) block in auth.ts"));
    }
  } catch (error) {
    console.log(chalk.red("Error adding socialProviders:"), error);
  }
};
