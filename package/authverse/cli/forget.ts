import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { packageManager } from "../utils/packageManager.js";

export const forget = async () => {
  try {
    // Get project directory
    const projectDir = process.cwd();

    // Get package json
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    if (!packageJson.dependencies?.resend) {
      console.log(chalk.cyan("\n⚙️ Installing Resend...\n"));
      packageManager("resend");
    }

    if (!packageJson.dependencies?.["@react-email/components"]) {
      console.log(chalk.cyan("\n⚙️ Installing react email components...\n"));
      packageManager("@react-email/components");
    }

    // Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

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

    // Add code for sendResetPassword with proper void return
    const codeAdded = `sendResetPassword: async ({ user, url, token }) => {
      await resend.emails.send({
        from: \`\${process.env.EMAIL_SENDER_NAME} <\${process.env.EMAIL_SENDER_ADDRESS}>\`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
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

      // Get the content inside emailAndPassword
      const emailAndPasswordContent = content.substring(
        emailAndPasswordStart,
        emailAndPasswordEnd
      );

      // Check if sendResetPassword already exists
      if (emailAndPasswordContent.includes("sendResetPassword:")) {
        // Replace existing sendResetPassword
        content = content.replace(
          /sendResetPassword:\s*async\s*\([^)]*\)[^{]*\{[^}]*\}[^,]*/,
          codeAdded
        );
      } else {
        // Insert sendResetPassword before the closing brace of emailAndPassword
        const before = content.substring(0, emailAndPasswordEnd);
        const after = content.substring(emailAndPasswordEnd);
        content = before + `\n ${codeAdded}` + after;
      }

      fs.writeFileSync(authFilePath, content, "utf8");

      // Check if resend import exists, if not add it
      if (
        !content.includes("import { Resend }") &&
        !content.includes("const resend = new Resend")
      ) {
        // Add import after the last import statement
        const lastImportIndex = content.lastIndexOf("import");
        const nextLineAfterLastImport =
          content.indexOf("\n", lastImportIndex) + 1;
        const beforeImports = content.substring(0, nextLineAfterLastImport);
        const afterImports = content.substring(nextLineAfterLastImport);

        const newImports = `import { Resend } from "resend";\nimport ForgotPasswordEmail from "@/components/email/reset-password";\n\nconst resend = new Resend(process.env.RESEND_API_KEY as string);\n`;
        content = beforeImports + newImports + afterImports;

        fs.writeFileSync(authFilePath, content, "utf8");
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

      // Add components/email/reset-password.tsx
      const componentPath = path.resolve(
        __dirname,
        "./template/email/reset-password.tsx"
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

      const emailDestinationPath = path.join(
        destinationPath,
        "reset-password.tsx"
      );

      if (fs.existsSync(componentPath)) {
        fs.copyFileSync(componentPath, emailDestinationPath);
      }

      // Add components/authverse/ForgetComponent.tsx
      const forgetComponentPath = path.resolve(
        __dirname,
        "./template/components/ForgetComponent.tsx"
      );
      const componentsDestinationPath = path.join(
        projectDir,
        folder,
        "components",
        "authverse"
      );

      // Ensure the directory exists before copying the file
      if (!fs.existsSync(componentsDestinationPath)) {
        fs.mkdirSync(componentsDestinationPath, { recursive: true });
      }

      const forgetDestinationPath = path.join(
        componentsDestinationPath,
        "ForgetComponent.tsx"
      );

      if (fs.existsSync(forgetComponentPath)) {
        fs.copyFileSync(forgetComponentPath, forgetDestinationPath);
      }

      // Add components/authverse/ResetComponent.tsx
      const resetComponentPath = path.resolve(
        __dirname,
        "./template/components/ResetComponent.tsx"
      );

      const resetDestinationPath = path.join(
        componentsDestinationPath,
        "ResetComponent.tsx"
      );

      if (fs.existsSync(resetComponentPath)) {
        fs.copyFileSync(resetComponentPath, resetDestinationPath);
      }

      // app add auth
      const authTemplatePath = path.resolve(
        __dirname,
        "./template/app-auth-uiDesign"
      );

      // Create app directory
      const appDestinationPath = path.join(projectDir, folder, "app", "auth");

      // Ensure the directory exists before copying the file
      if (!fs.existsSync(appDestinationPath)) {
        fs.mkdirSync(appDestinationPath, { recursive: true });
      }

      // Create forget directory
      const forgetDestinationDir = path.join(appDestinationPath, "forget");

      if (!fs.existsSync(forgetDestinationDir)) {
        fs.mkdirSync(forgetDestinationDir, { recursive: true });
      }

      // Copy forget page.tsx
      const forgetPageDestinationPath = path.join(
        forgetDestinationDir,
        "page.tsx"
      );
      fs.copyFileSync(
        `${authTemplatePath}/forget/page.tsx`,
        forgetPageDestinationPath
      );

      // Create reset-password directory
      const resetDestinationDir = path.join(
        appDestinationPath,
        "reset-password"
      );

      if (!fs.existsSync(resetDestinationDir)) {
        fs.mkdirSync(resetDestinationDir, { recursive: true });
      }

      // Copy reset-password page.tsx
      const resetPageDestinationPath = path.join(
        resetDestinationDir,
        "page.tsx"
      );

      fs.copyFileSync(
        `${authTemplatePath}/reset-password/page.tsx`,
        resetPageDestinationPath
      );

      console.log(
        chalk.green("Successfully added forget and reset-password pages")
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
