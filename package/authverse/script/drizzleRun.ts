import chalk from "chalk";
import path from "path";
import fs from "fs";
import { drizzleNextSetup } from "../drizzle/drizzleNextSetup.js";
import { drizzleNextChecker } from "../drizzle/drizzleNextChecker.js";

export interface drizzleProps {
  authUi: boolean;
  cmd: boolean;
}

export const drizzleRun = async ({ authUi, cmd }: drizzleProps) => {
  try {
    // Get project directory
    const projectDir = process.cwd();

    // Check drizzle exists
    const drizzleConfigPath = path.join(projectDir, "drizzle.config.ts");

    if (fs.existsSync(drizzleConfigPath)) {
      await drizzleNextChecker({ authUi, cmd, projectDir });
    } else {
      await drizzleNextSetup({ authUi, cmd, projectDir });
    }
  } catch (err) {
    console.error(chalk.red("Drizzle setup failed:"), err);
  }
};
