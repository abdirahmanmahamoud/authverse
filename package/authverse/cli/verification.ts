import chalk from "chalk";
import fs from "fs";
import path from "path";
import { verifyNext } from "../script/verifyNext.js";
import { verifyTanstack } from "../script/verifyTanstack.js";

export const verification = async () => {
  try {
    const projectDir = process.cwd();
    const packageJsonPath = path.join(projectDir, "package.json");

    // Auto detect framework
    let framework: "Next js" | "tanstack state" = "tanstack state";

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      const hasNext =
        packageJson?.dependencies?.["next"] ||
        packageJson?.devDependencies?.["next"];

      framework = hasNext ? "Next js" : "tanstack state";
    }

    if (framework === "Next js") {
      await verifyNext();
    }
    if (framework === "tanstack state") {
      await verifyTanstack();
    }
  } catch (error: any) {
    console.log(chalk.red(error.message));
  }
};
