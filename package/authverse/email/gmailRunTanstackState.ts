import chalk from "chalk";
import path from "path";
import fs from "fs";
import { packageManager } from "../utils/packageManager.js";
import { fileURLToPath } from "url";

export const gmailRunTanstackState = async () => {
  try {
    const projectDir = process.cwd();
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (
      !packageJson.dependencies?.nodemailer ||
      !packageJson.devDependencies?.["@types/nodemailer"]
    ) {
      console.log(chalk.cyan("\n⚙️  Installing nodemailer...\n"));
      packageManager("nodemailer");
      packageManager("@types/nodemailer", true);
    }

    if (!packageJson.dependencies?.["@react-email/components"]) {
      console.log(chalk.cyan("\n⚙️  Installing @react-email/components...\n"));
      packageManager("@react-email/components");
    }

    // add .env variables info
    const envPath = path.join(projectDir, ".env");
    const envContent = fs.readFileSync(envPath, "utf8");

    if (
      !envContent.includes("GMAIL_HOST") &&
      !envContent.includes("GMAIL_PORT") &&
      !envContent.includes("GMAIL_SERVICE") &&
      !envContent.includes("GMAIL_MAIL") &&
      !envContent.includes("GMAIL_NAME") &&
      !envContent.includes("GMAIL_PASSWORD")
    ) {
      fs.appendFileSync(envPath, `\n\n# Gmail API Key for sending emails`);
      fs.appendFileSync(envPath, `\nGMAIL_HOST=`);
      fs.appendFileSync(envPath, `\nGMAIL_PORT=`);
      fs.appendFileSync(envPath, `\nGMAIL_SERVICE=`);
      fs.appendFileSync(envPath, `\nGMAIL_MAIL=`);
      fs.appendFileSync(envPath, `\nGMAIL_NAME=`);
      fs.appendFileSync(envPath, `\nGMAIL_PASSWORD=`);
    }

    // template/email/gmail.tsx
    const templatePath = path.resolve(
      __dirname,
      "./template/email/emailGmail.ts"
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
