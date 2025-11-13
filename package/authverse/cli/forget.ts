import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export const forget = async () => {
  try {
    execSync("npm install @react-email/components resend", {
      stdio: "inherit",
    });

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

    // Add code for sendResetPassword
    const codeAdded = `sendResetPassword: async ({ user, url }) => {
      return resend.emails.send({
        from: \`\${process.env.EMAIL_SENDER_NAME} <\${process.env.EMAIL_SENDER_ADDRESS}>\`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({ username: user.name, resetUrl: url, userEmail: user.email }),
      });
    },`;

    // Find where to insert (inside emailAndPassword config)
    if (content.includes("emailAndPassword: {")) {
      // Check if emailAndPassword config exists
      const emailAndPasswordStart = content.indexOf("emailAndPassword: {");
      let emailAndPasswordEnd = emailAndPasswordStart;
      let braceCount = 0;
      let inEmailAndPassword = false;

      // Find the closing brace of emailAndPassword object
      for (let i = emailAndPasswordStart; i < content.length; i++) {
        if (content[i] === "{") {
          braceCount++;
          inEmailAndPassword = true;
        } else if (content[i] === "}") {
          braceCount--;
          if (inEmailAndPassword && braceCount === 0) {
            emailAndPasswordEnd = i;
            break;
          }
        }
      }

      // Insert sendResetPassword before the closing brace of emailAndPassword
      const before = content.substring(0, emailAndPasswordEnd);
      const after = content.substring(emailAndPasswordEnd);
      content = before + `,\n    ${codeAdded}` + after;

      fs.writeFileSync(authFilePath, content, "utf8");

      // Check if sendEmail import exists, if not add it
      if (!content.includes("import { sendEmail }")) {
        // Add import after the last import statement
        const lastImportIndex = content.lastIndexOf("import");
        const nextLineAfterLastImport =
          content.indexOf("\n", lastImportIndex) + 1;
        const beforeImports = content.substring(0, nextLineAfterLastImport);
        const afterImports = content.substring(nextLineAfterLastImport);
        content =
          beforeImports +
          `import { Resend } from "resend";\nimport ForgotPasswordEmail from "@/components/email/reset-password";\n\nconst resend = new Resend(process.env.RESEND_API_KEY as string);\n` +
          afterImports;

        fs.writeFileSync(authFilePath, content, "utf8");
      }

      // add .env variables info
      const envPath = path.join(projectDir, ".env");
      fs.appendFileSync(envPath, `\n\n# Resend API Key for sending emails`);
      fs.appendFileSync(envPath, `\nRESEND_API_KEY=`);
      fs.appendFileSync(
        envPath,
        `\nEMAIL_SENDER_NAME=Your Name\nEMAIL_SENDER_ADDRESS=`
      );

      // add reset-password.tsx to components/email
      const componentPath = path.resolve(
        __dirname,
        "../../template/components/email/reset-password.tsx"
      );
      const destinationPath = path.join(
        projectDir,
        folder,
        "components",
        "email"
      );
      // Ensure the directory exists before copying the file
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }
      const LoginDestinationPath = path.join(
        destinationPath,
        "reset-password.tsx"
      );
      fs.copyFileSync(componentPath, LoginDestinationPath);

      // add components/authverse/ForgetComponent.tsx
      const ForgetComponentPath = path.resolve(
        __dirname,
        "../../template/components/authverse/ForgetComponent.tsx"
      );
      const ForgetDestinationPath = path.join(
        projectDir,
        folder,
        "components",
        "authverse"
      );
      // Ensure the directory exists before copying the file
      if (!fs.existsSync(ForgetDestinationPath)) {
        fs.mkdirSync(ForgetDestinationPath, { recursive: true });
      }
      const ForgetComponentDestinationPath = path.join(
        ForgetDestinationPath,
        "ForgetComponent.tsx"
      );
      fs.copyFileSync(ForgetComponentPath, ForgetComponentDestinationPath);

      // Create app directory
      const appDestinationPath = path.join(projectDir, folder, "app", "auth");

      // Ensure the directory exists before copying the file
      if (!fs.existsSync(appDestinationPath)) {
        fs.mkdirSync(appDestinationPath, { recursive: true });
      }
      // Copy forget/page.tsx
      const forgetPageTemplatePath = path.resolve(
        __dirname,
        "../../template/app/auth/forget/page.tsx"
      );
      const forgetPageDestinationPath = path.join(appDestinationPath, "forget");
      if (!fs.existsSync(forgetPageDestinationPath)) {
        fs.mkdirSync(forgetPageDestinationPath, { recursive: true });
      }
      const forgetPageFinalPath = path.join(
        forgetPageDestinationPath,
        "page.tsx"
      );
      fs.copyFileSync(forgetPageTemplatePath, forgetPageFinalPath);

      // Copy reset-password/page.tsx
      const resetPasswordPageTemplatePath = path.resolve(
        __dirname,
        "../../template/app/auth/reset-password/page.tsx"
      );
      const resetPasswordPageDestinationPath = path.join(
        appDestinationPath,
        "reset-password"
      );
      if (!fs.existsSync(resetPasswordPageDestinationPath)) {
        fs.mkdirSync(resetPasswordPageDestinationPath, { recursive: true });
      }
      const resetPasswordPageFinalPath = path.join(
        resetPasswordPageDestinationPath,
        "page.tsx"
      );
      fs.copyFileSync(
        resetPasswordPageTemplatePath,
        resetPasswordPageFinalPath
      );

      console.log(
        chalk.green("Added sendResetPassword configuration successfully")
      );
    } else {
      console.log(
        chalk.red("Could not find emailAndPassword configuration in auth.ts")
      );
    }
  } catch (error) {
    console.log(chalk.red("Error adding sendResetPassword:"), error);
  }
};
