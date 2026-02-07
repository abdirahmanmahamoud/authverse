#!/usr/bin/env node
import { Command } from "commander";
import { initAnswer } from "./cli/init.js";
import { readFileSync } from "fs";
import { providers } from "./cli/provider.js";
import { forget } from "./cli/forget.js";
import { email } from "./cli/email.js";
import { verification } from "./cli/verification.js";
import { cmdType, initCmd } from "./cli/initCmd.js";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
const program = new Command();

program
  .name("authverse")
  .description("CLI tool for creating authverse projects")
  .version(
    packageJson.version || "1.0.0",
    "-v, --version",
    "display the version number",
  );

program
  .command("init")
  .description("Select project template and configuration")
  .option("--orm <type>", "Select ORM (prisma, drizzle)")
  .option("--db <type>", "Select database (mysql, postgres, mongodb)")
  .option("--authUi <value>", "Include auth UI (yes/no)")
  .action(async (cmd: cmdType) => {
    if (!cmd.orm || !cmd.db || !cmd.authUi) {
      await initAnswer();
    } else {
      await initCmd(cmd);
    }
  });

program
  .command("add <provider>")
  .description("Add a new authentication provider")
  .action(async (provider: string) => {
    await providers({ provider });
  });

program
  .command("forget")
  .description("Forget stored configurations")
  .action(async () => {
    await forget();
  });

program
  .command("email")
  .description("Configure email settings")
  .action(async () => {
    await email();
  });

program
  .command("verify")
  .description("Verify authentication setup")
  .action(async () => {
    await verification();
  });

program.parse(process.argv);
