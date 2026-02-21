import inquirer from "inquirer";
import { prismaRun } from "../script/prisma.js";
import { drizzleRun } from "../script/drizzleRun.js";
import { prismaRunTanstackStart } from "../script/prismaRunTanstackStart.js";
import { drizzleRunTanstackStart } from "../script/drizzleRunTanstackStart.js";
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
      cmd: false,
    });
  }

  // nextjs or Drizzle Installation
  if (framework === "Next js" && answers.orm === "Drizzle") {
    await drizzleRun({
      authUi: answers.authUi,
      cmd: false,
    });
  }

  // tanstack start or Prisma Installation
  if (framework === "tanstack start" && answers.orm === "Prisma") {
    await prismaRunTanstackStart({
      authUi: answers.authUi,
      database: answers.database,
      cmd: false,
    });
  }

  // tanstack start or Drizzle Installation
  if (framework === "tanstack start" && answers.orm === "Drizzle") {
    await drizzleRunTanstackStart({
      authUi: answers.authUi,
      cmd: false,
    });
  }
};
