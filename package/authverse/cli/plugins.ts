import chalk from "chalk";
import { getFramework } from "../utils/framework.js";
import { emailOtpNext } from "../plugin/emailOtpNext.js";
import { emailOtpTanstackStart } from "../plugin/emailOtpTanstackStart.js";

export const Plugins = async ({ plugins }: { plugins: string }) => {
  try {
    const { framework, error } = await getFramework();

    if (error) {
      console.log(chalk.red(error));
      return;
    }

    if (plugins === "email-otp") {
      if (framework === "Next js") {
        await emailOtpNext();
      } else if (framework === "tanstack start") {
        await emailOtpTanstackStart();
      }
      return;
    }

    console.log(chalk.red("Invalid plugin"));
  } catch (error) {
    console.log(chalk.red("Error adding plugins:"), error);
  }
};
