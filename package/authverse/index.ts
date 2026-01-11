#!/usr/bin/env node
import { Command } from "commander";
import { initAnswer } from "./cli/init.js";
import { readFileSync } from "fs";
import { providers } from "./cli/provider.js";
import { forget } from "./cli/forget.js";
import { isNextJsProject } from "./script/detect-nextjs.js";
import chalk from "chalk";
import { email } from "./cli/email.js";
import { verification } from "./cli/verification.js";
const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

const program = new Command();

program
  .name("authverse")
  .description("CLI tool for creating authverse projects")
  .version(
    packageJson.version || "1.0.0",
    "-v, --version",
    "display the version number"
  );

program
  .command("init")
  .description("Select project template and configuration")
  .action(() => {
    if (!isNextJsProject) {
      console.log(chalk.red("Only Next.js projects are supported."));
      process.exit(1);
    }
    initAnswer();
  });

program
  .command("add <provider>")
  .description("Add a new authentication provider")
  .action((provider: string) => providers({ provider }));

program
  .command("forget")
  .description("Forget stored configurations")
  .action(forget);

program.command("email").description("Configure email settings").action(email);

program
  .command("verify")
  .description("Verify authentication setup")
  .action(verification);

program.parse(process.argv);
