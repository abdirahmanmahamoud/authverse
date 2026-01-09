import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { packageManager } from "../utils/packageManager.js";
import { email } from "../cli/email.js";

export const forgetTanstack = async () => {
  try {
    // Get project directory
    const projectDir = process.cwd();

    // Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Check Next.js folder structure src
    const srcPath = path.join(projectDir, "src");

    // check exits email.ts
    const emailFilePath = path.join(srcPath, "lib", "email.ts");
    if (!fs.existsSync(emailFilePath)) {
      await email();
    }

    // Locate auth.ts file
    const authFilePath = path.join(srcPath, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("auth.ts file not found."));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    // Add code for sendResetPassword with proper void return
    const codeAdded = `sendResetPassword: async ({ user, url, token }) => {
      await sendEmail({
        email: user.email!,
        subject: "Reset your password",
        components: ForgotPasswordEmail({
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
      if (!content.includes("import { sendEmail }")) {
        // Add import after the last import statement
        const lastImportIndex = content.lastIndexOf("import");
        const nextLineAfterLastImport =
          content.indexOf("\n", lastImportIndex) + 1;
        const beforeImports = content.substring(0, nextLineAfterLastImport);
        const afterImports = content.substring(nextLineAfterLastImport);

        const newImports = `import ForgotPasswordEmail from "@/components/email/reset-password";\nimport { sendEmail } from "./email";\n`;

        content = beforeImports + newImports + afterImports;

        fs.writeFileSync(authFilePath, content, "utf8");
      }

      // Add components/email/reset-password.tsx
      const componentPath = path.resolve(
        __dirname,
        "./template/email/reset-password.tsx"
      );

      const destinationPath = path.join(srcPath, "components", "email");

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
        "./template/TanstackState/components/ForgetComponent.tsx"
      );
      const componentsDestinationPath = path.join(
        srcPath,
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
        "./template/TanstackState/components/ResetComponent.tsx"
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
        "./template/TanstackState/routes/auth"
      );

      // Create app directory
      const routesDestinationPath = path.join(srcPath, "routes", "auth");

      // Ensure the directory exists before copying the file
      if (!fs.existsSync(routesDestinationPath)) {
        fs.mkdirSync(routesDestinationPath, { recursive: true });
      }
      // Copy forget page.tsx
      const forgetPageDestinationPath = path.join(
        routesDestinationPath,
        "forget.tsx"
      );
      fs.copyFileSync(
        `${authTemplatePath}/forget.tsx`,
        forgetPageDestinationPath
      );

      // Copy reset-password page.tsx
      const resetPageDestinationPath = path.join(
        routesDestinationPath,
        "reset-password.tsx"
      );

      fs.copyFileSync(
        `${authTemplatePath}/reset-password.tsx`,
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
