import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import { gmailRun } from "../email/gmailRun.js";

export const email = async () => {
  const projectDir = process.cwd();
  const packageJsonPath = path.join(projectDir, "package.json");

  // Auto detect framework
  let framework: "Next js" | "tanstack state" = "tanstack state";

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const hasNext =
      packageJson?.dependencies?.["next"] ||
      packageJson?.devDependencies?.["next"];

    framework = hasNext ? "Next js" : "tanstack state";
  }

  if (framework === "Next js") {
    const srcFolder = fs.existsSync(path.join(projectDir, "src")) ? "src" : "";

    // check exists lib/email.ts
    const emailPath = path.join(projectDir, srcFolder, "lib", "email.ts");
    if (fs.existsSync(emailPath)) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message:
            "Do you want to overwrite existing auth lib/email.ts file before running this command",
          default: false,
        },
      ]);

      if (!answers.overwrite) {
        return;
      }
    }
  }

  //   Tanstack state
  if (framework === "tanstack state") {
    const srcFolderTanstackState = path.join(projectDir, "src");
    const libPathTanstackState = path.join(
      srcFolderTanstackState,
      "lib/email.ts"
    );
    if (fs.existsSync(libPathTanstackState)) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message:
            "Do you want to overwrite existing auth lib/email.ts file before running this command",
          default: false,
        },
      ]);

      if (!answers.overwrite) {
        return;
      }
    }
  }
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "emailProvider",
      message: "Choose Your Email Provider:",
      choices: ["Gmail", "AWS SES", "Resend"],
    },
  ]);

  if (answers.emailProvider === "Gmail" && framework === "Next js") {
    await gmailRun();
  }
};
