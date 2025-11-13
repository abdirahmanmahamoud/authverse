import chalk from "chalk";
import { googleRun } from "../script/googleRun.js";

export const providers = async ({ provider }: { provider: string }) => {
  try {
    if (provider == "google") {
      await googleRun();
    }
  } catch (error) {
    console.log(chalk.red("Error adding provider:"), error);
  }
};
