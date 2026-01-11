import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { email } from "../cli/email.js";

export const verifyTanstack = async () => {
  try {
    const projectDir = process.cwd();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const srcPath = path.join(projectDir, "src");

    // Ensure email.ts exists
    const emailFilePath = path.join(srcPath, "lib", "email.ts");
    if (!fs.existsSync(emailFilePath)) {
      await email();
    }

    // Locate auth.ts
    const authFilePath = path.join(srcPath, "lib", "auth.ts");
    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("auth.ts file not found."));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    // HANDLE emailAndPassword
    if (content.includes("emailAndPassword: {")) {
      const start = content.indexOf("emailAndPassword: {");
      let end = start;
      let braces = 0;
      let inside = false;

      for (let i = start; i < content.length; i++) {
        if (content[i] === "{") {
          braces++;
          inside = true;
        } else if (content[i] === "}") {
          braces--;
          if (inside && braces === 0) {
            end = i;
            break;
          }
        }
      }

      const emailAndPasswordBlock = content.slice(start, end);

      // Add requireEmailVerification if missing
      if (!emailAndPasswordBlock.includes("requireEmailVerification")) {
        const before = content.slice(0, end);
        const after = content.slice(end);

        content =
          before +
          `
    requireEmailVerification: true,` +
          after;
      }
    }

    if (!content.includes("emailVerification:")) {
      const insertAt = content.lastIndexOf("},");

      const emailVerificationBlock = `
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        email: user.email!,
        subject: "Verify your email",
        components: EmailVerification({
          name: user.name ?? "User",
          url,
        }),
      });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
  },
`;

      content =
        content.slice(0, insertAt + 2) +
        emailVerificationBlock +
        content.slice(insertAt + 2);
    }

    if (!content.includes("EmailVerification")) {
      const lastImport = content.lastIndexOf("import");
      const nextLine = content.indexOf("\n", lastImport) + 1;

      const imports = `import EmailVerification from "@/components/email/EmailVerification";
import { sendEmail } from "./email";
`;

      content = content.slice(0, nextLine) + imports + content.slice(nextLine);
    }

    fs.writeFileSync(authFilePath, content, "utf8");

    const templatePath = path.resolve(
      __dirname,
      "./template/email/EmailVerification.tsx"
    );

    const componentsDir = path.join(srcPath, "components", "email");

    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    const destFile = path.join(componentsDir, "EmailVerification.tsx");

    if (fs.existsSync(templatePath) && !fs.existsSync(destFile)) {
      fs.copyFileSync(templatePath, destFile);
    }

    console.log(chalk.green("Email verification successfully configured"));
  } catch (error) {
    console.log(chalk.red(String(error)));
  }
};
