import chalk from "chalk";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GenerateSecret } from "../utils/GenerateSecret.js";
import { packageManager } from "../utils/packageManager.js";
import { authUiTanstackState } from "./authUiTanstackState.js";
import { drizzleTanstackSetup } from "../drizzle/drizzleTanstackSetup.js";

interface drizzleRunTanstackStartProps {
  authUi: boolean;
  cmd: boolean;
}

export const drizzleRunTanstackStart = async ({
  authUi,
  cmd,
}: drizzleRunTanstackStartProps) => {
  try {
    // Get project directory
    const projectDir = process.cwd();

    // Check drizzle exists
    const drizzleConfigPath = path.join(projectDir, "drizzle.config.ts");

    if (fs.existsSync(drizzleConfigPath)) {
      // await drizzleTanstackChecker({ authUi, cmd, projectDir });
    } else {
      await drizzleTanstackSetup({ authUi, cmd, projectDir });
    }
  } catch (err) {
    console.error(chalk.red("Drizzle setup failed:"), err);
  }
};
