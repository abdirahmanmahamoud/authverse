import chalk from "chalk";
import { googleRun } from "../script/googleRun.js";
import { githubRun } from "../script/githubRun.js";
import { googleRunTanstackState } from "../script/googleRunTanstackState.js";
import { githubRunTanstackState } from "../script/githubRunTanstackState.js";
import { getFramework } from "../utils/framework.js";

export const providers = async ({ provider }: { provider: string }) => {
  try {
    const { framework, error } = await getFramework();

    if (error) {
      console.log(chalk.red(error));
      return;
    }

    if (framework === "Next js" && provider == "google") {
      await googleRun();
    } else if (framework === "Next js" && provider == "github") {
      await githubRun();
    }

    if (framework === "tanstack state" && provider == "google") {
      await googleRunTanstackState();
    } else if (framework === "tanstack state" && provider == "github") {
      await githubRunTanstackState();
    }
  } catch (error) {
    console.log(chalk.red("Error adding provider:"), error);
  }
};
