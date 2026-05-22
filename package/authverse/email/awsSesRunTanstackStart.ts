import chalk from "chalk";
import path from "path";
import fs from "fs";
import { packageManager } from "../utils/packageManager.js";
import { fileURLToPath } from "url";

export const awsSesRunTanstackStart = async () => {
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

    if (!packageJson.dependencies?.["@react-email/render"]) {
      console.log(chalk.cyan("\n⚙️  Installing @react-email/render...\n"));
      packageManager("@react-email/render");
    }

    // add .env variables info
    const envPath = path.join(projectDir, ".env");
    const envContent = fs.readFileSync(envPath, "utf8");

    if (
      !envContent.includes("AWS_SES_HOST") &&
      !envContent.includes("AWS_SES_PORT") &&
      !envContent.includes("AWS_SES_SERVICE") &&
      !envContent.includes("AWS_SES_USER") &&
      !envContent.includes("AWS_SES_PASS") &&
      !envContent.includes("AWS_SES_FROM") &&
      !envContent.includes("AWS_SES_FROM_NAME")
    ) {
      fs.appendFileSync(envPath, `\n\n# AWS SES API Key for sending emails`);
      fs.appendFileSync(envPath, `\nAWS_SES_HOST=`);
      fs.appendFileSync(envPath, `\nAWS_SES_PORT=`);
      fs.appendFileSync(envPath, `\nAWS_SES_SERVICE=`);
      fs.appendFileSync(envPath, `\nAWS_SES_USER=`);
      fs.appendFileSync(envPath, `\nAWS_SES_PASS=`);
      fs.appendFileSync(envPath, `\nAWS_SES_FROM=`);
      fs.appendFileSync(envPath, `\nAWS_SES_FROM_NAME=`);
    }

    // template/email/emailAwsSes.ts
    const templatePath = path.resolve(
      __dirname,
      "./template/email/emailAwsSes.ts",
    );

    // create lib/email.ts
    const libPath = path.join(projectDir, "src", "lib");
    if (!fs.existsSync(libPath)) {
      fs.mkdirSync(libPath, { recursive: true });
    }
    const libDestinationPath = path.join(libPath, "email.ts");
    fs.copyFileSync(templatePath, libDestinationPath);

    console.log(chalk.green("\nCompleted installation successfully"));
    console.log(chalk.cyan("\nInstall Package:"));
    console.log(
      chalk.white(
        `• nodemailer\n• @react-email/components\n• @react-email/render`,
      ),
    );
    console.log(chalk.cyan("\nFiles created:"));
    console.log(chalk.white("• src/lib/email.ts\n"));
  } catch (error) {
    console.log(chalk.red(error));
  }
};
