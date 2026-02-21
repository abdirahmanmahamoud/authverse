import chalk from "chalk";
import { getFramework } from "../utils/framework.js";
import { verifyNext } from "../script/verifyNext.js";
import { verifyTanstack } from "../script/verifyTanstack.js";

export const verification = async () => {
  try {
    const { framework, error } = await getFramework();

    if (error) {
      console.log(chalk.red(error));
      return;
    }

    if (framework === "Next js") {
      await verifyNext();
    }
    if (framework === "tanstack start") {
      await verifyTanstack();
    }
  } catch (error: any) {
    console.log(chalk.red(error.message));
  }
};
