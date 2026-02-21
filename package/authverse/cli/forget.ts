import { forgetNext } from "../script/forgetNext.js";
import { forgetTanstack } from "../script/forgetTanstack.js";
import { getFramework } from "../utils/framework.js";
import chalk from "chalk";

export const forget = async () => {
  const { framework, error } = await getFramework();

  if (error) {
    console.log(chalk.red(error));
    return;
  }

  if (framework === "Next js") {
    return forgetNext();
  }
  if (framework === "tanstack start") {
    return forgetTanstack();
  }
};
