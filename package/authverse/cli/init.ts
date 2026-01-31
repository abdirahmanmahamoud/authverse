import inquirer from "inquirer";
import { prismaRun } from "../script/prisma.js";
import { drizzleRun } from "../script/drizzleRun.js";
import { prismaRunTanstackState } from "../script/prismaRunTanstackState.js";
import { drizzleRunTanstackState } from "../script/drizzleRunTanstackState.js";
import { getFramework } from "../utils/framework.js";
import chalk from "chalk";

export const initAnswer = async () => {
  const { framework, error } = await getFramework();

  if (error) {
    console.log(chalk.red(error));
    return;
  }

  console.log(`✔ Detected framework: ${framework}`);

  // User prompts (NO framework)
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "orm",
      message: "Choose Your ORM:",
      choices: ["Prisma", "Drizzle"],
    },
    {
      type: "list",
      name: "database",
      message: "Select Database:",
      choices: ["Postgresql", "Mongodb", "Mysql"],
      when: (ans) => ans.orm === "Prisma",
    },
    {
      type: "confirm",
      name: "authUi",
      message: "Do you want to include auth UI design?",
      default: true,
    },
  ]);

  // nextjs or prisma Installation
  if (framework === "Next js" && answers.orm === "Prisma") {
    await prismaRun({
      authUi: answers.authUi,
      database: answers.database,
    });
  }

  // nextjs or Drizzle Installation
  if (framework === "Next js" && answers.orm === "Drizzle") {
    await drizzleRun(answers.authUi);
  }

  // tanstack state or Prisma Installation
  if (framework === "tanstack state" && answers.orm === "Prisma") {
    await prismaRunTanstackState({
      authUi: answers.authUi,
      database: answers.database,
    });
  }

  // tanstack state or Drizzle Installation
  if (framework === "tanstack state" && answers.orm === "Drizzle") {
    await drizzleRunTanstackState(answers.authUi);
  }
};
