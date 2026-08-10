import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { email } from "../cli/email.js";

export const emailOtpTanstackStart = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const projectDir = process.cwd();

    const srcPath = path.join(projectDir, "src");

    // ensure email.ts exists
    const emailFilePath = path.join(srcPath, "lib", "email.ts");
    if (!fs.existsSync(emailFilePath)) {
      await email();
    }

    // locate auth.ts
    const authFilePath = path.join(srcPath, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("No Configured Better Auth file found"));
      console.log(chalk.cyan("Run authverse init to initialize better auth"));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    if (!content.includes("betterAuth({")) {
      console.log(chalk.red("betterAuth({}) block not found"));
      return;
    }

    // prevent duplicate
    if (content.includes("emailOTP(")) {
      console.log(chalk.yellow("Email OTP plugin already exists"));
      return;
    }

    const emailOtpEntry = `emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          await sendEmail({
            email,
            subject: "Your sign-in code",
            components: OtpVerification({ otp, type }),
          });
        } else if (type === "email-verification") {
          await sendEmail({
            email,
            subject: "Verify your email address",
            components: OtpVerification({ otp, type }),
          });
        } else {
          await sendEmail({
            email,
            subject: "Reset your password",
            components: OtpVerification({ otp, type }),
          });
        }
      },
    })`;

    // add emailOTP to existing plugins array
    if (content.includes("plugins: [")) {
      const pluginsStart = content.indexOf("plugins: [");
      const pluginsEnd = content.indexOf("]", pluginsStart);
      const inside = content.slice(
        pluginsStart + "plugins: [".length,
        pluginsEnd,
      );
      const entry = `${inside.trim().length > 0 ? ", " : ""}${emailOtpEntry}`;

      content =
        content.slice(0, pluginsEnd) + entry + content.slice(pluginsEnd);
    } else {
      // no plugins key -> create one after the database adapter
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

      const pluginsBlock = `
  plugins: [${emailOtpEntry}],`;

      content = content.replace(
        databaseRegex,
        (match) => `${match}\n${pluginsBlock}`,
      );
    }

    // add imports
    if (!content.includes('import { emailOTP } from "better-auth/plugins"')) {
      const lastImport = content.lastIndexOf("import");
      const nextLine = content.indexOf("\n", lastImport) + 1;
      const imports = `import { emailOTP } from "better-auth/plugins";\n`;

      content = content.slice(0, nextLine) + imports + content.slice(nextLine);
    }

    if (!content.includes("import { sendEmail }")) {
      const lastImport = content.lastIndexOf("import");
      const nextLine = content.indexOf("\n", lastImport) + 1;
      const imports = `import { sendEmail } from "./email";\n`;

      content = content.slice(0, nextLine) + imports + content.slice(nextLine);
    }

    if (!content.includes("import OtpVerification from")) {
      const lastImport = content.lastIndexOf("import");
      const nextLine = content.indexOf("\n", lastImport) + 1;
      const imports = `import OtpVerification from "@/components/email/OtpVerification";\n`;

      content = content.slice(0, nextLine) + imports + content.slice(nextLine);
    }

    fs.writeFileSync(authFilePath, content, "utf8");

    // locate auth-client.ts
    const authClientPath = path.join(srcPath, "lib", "auth-client.ts");

    if (fs.existsSync(authClientPath)) {
      let clientContent = fs.readFileSync(authClientPath, "utf8");

      if (!clientContent.includes("emailOTPClient")) {
        if (!clientContent.includes("import { emailOTPClient }")) {
          const lastImport = clientContent.lastIndexOf("import");
          const nextLine = clientContent.indexOf("\n", lastImport) + 1;
          const imports = `import { emailOTPClient } from "better-auth/client/plugins";\n`;

          clientContent =
            clientContent.slice(0, nextLine) +
            imports +
            clientContent.slice(nextLine);
        }

        if (clientContent.includes("plugins: [")) {
          const pluginsStart = clientContent.indexOf("plugins: [");
          const pluginsEnd = clientContent.indexOf("]", pluginsStart);
          const inside = clientContent.slice(
            pluginsStart + "plugins: [".length,
            pluginsEnd,
          );
          const entry = `${inside.trim().length > 0 ? ", " : ""}emailOTPClient()`;

          clientContent =
            clientContent.slice(0, pluginsEnd) +
            entry +
            clientContent.slice(pluginsEnd);
        } else {
          const insertAt = clientContent.lastIndexOf("});");
          const pluginsBlock = `  plugins: [emailOTPClient()],\n`;

          clientContent =
            clientContent.slice(0, insertAt) +
            pluginsBlock +
            clientContent.slice(insertAt);
        }

        fs.writeFileSync(authClientPath, clientContent, "utf8");
      }
    }

    // copy OtpVerification.tsx
    const templatePath = path.resolve(
      __dirname,
      "./template/email/OtpVerification.tsx",
    );

    const componentsDir = path.join(srcPath, "components", "email");

    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    const destFile = path.join(componentsDir, "OtpVerification.tsx");

    if (fs.existsSync(templatePath) && !fs.existsSync(destFile)) {
      fs.copyFileSync(templatePath, destFile);
    }

    console.log(chalk.green("Email OTP plugin added successfully\n"));
    console.log(
      chalk.white(
        `• src/lib/auth.ts\n• src/lib/auth-client.ts\n• src/components/email/OtpVerification.tsx\n`,
      ),
    );
  } catch (error) {
    console.log(chalk.red("emailOtpTanstackStart error:"), error);
  }
};
