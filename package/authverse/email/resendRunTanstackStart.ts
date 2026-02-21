import chalk from "chalk";
import path from "path";
import fs from "fs";
import { packageManager } from "../utils/packageManager.js";
import { fileURLToPath } from "url";

export const resendRunTanstackStart = async () => {
  try {
    const projectDir = process.cwd();
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!packageJson.dependencies?.resend) {
      console.log(chalk.cyan("\n⚙️ Installing Resend...\n"));
      packageManager("resend");
    }

    if (!packageJson.dependencies?.["@react-email/components"]) {
      console.log(chalk.cyan("\n⚙️  Installing @react-email/components...\n"));
      packageManager("@react-email/components");
    }

    // add .env variables info
    const envPath = path.join(projectDir, ".env");
    const envContent = fs.readFileSync(envPath, "utf8");

    if (
      !envContent.includes("RESEND_API_KEY") &&
      !envContent.includes("EMAIL_SENDER_NAME") &&
      !envContent.includes("EMAIL_SENDER_ADDRESS")
    ) {
      fs.appendFileSync(envPath, `\n\n# Resend API Key for sending emails`);
      fs.appendFileSync(envPath, `\nRESEND_API_KEY=`);
      fs.appendFileSync(envPath, `\nEMAIL_SENDER_NAME=Your Name`);
      fs.appendFileSync(envPath, `\nEMAIL_SENDER_ADDRESS=`);
    }

    // template/email/resend.tsx
    const templatePath = path.resolve(
      __dirname,
      "./template/email/emailResend.ts",
    );

    // create lib/email.ts
    const libPath = path.join(projectDir, "src", "lib");
    if (!fs.existsSync(libPath)) {
      fs.mkdirSync(libPath, { recursive: true });
    }
    const libDestinationPath = path.join(libPath, "email.ts");
    fs.copyFileSync(templatePath, libDestinationPath);
  } catch (error) {
    console.log(chalk.red(error));
  }
};
