import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import { gmailRun } from "../email/gmailRun.js";
import { gmailRunTanstackStart } from "../email/gmailRunTanstackStart.js";
import { awsSesRun } from "../email/awsSesRun.js";
import { awsSesRunTanstackStart } from "../email/awsSesRunTanstackStart.js";
import { resendRun } from "../email/resendRun.js";
import { resendRunTanstackStart } from "../email/resendRunTanstackStart.js";
import { getFramework } from "../utils/framework.js";
import chalk from "chalk";

export const email = async () => {
  const projectDir = process.cwd();
  const { framework, error } = await getFramework();

  if (error) {
    console.log(chalk.red(error));
    return;
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

  //   Tanstack start
  if (framework === "tanstack start") {
    const srcFolderTanstackState = path.join(projectDir, "src");
    const libPathTanstackState = path.join(
      srcFolderTanstackState,
      "lib/email.ts",
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
  if (answers.emailProvider === "Gmail" && framework === "tanstack start") {
    await gmailRunTanstackStart();
  }
  if (answers.emailProvider === "AWS SES" && framework === "Next js") {
    await awsSesRun();
  }
  if (answers.emailProvider === "AWS SES" && framework === "tanstack start") {
    await awsSesRunTanstackStart();
  }
  if (answers.emailProvider === "Resend" && framework === "Next js") {
    await resendRun();
  }
  if (answers.emailProvider === "Resend" && framework === "tanstack start") {
    await resendRunTanstackStart();
  }
};
