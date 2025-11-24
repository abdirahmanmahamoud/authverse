import inquirer from "inquirer";
import { prismaRun } from "../script/prisma.js";
import { drizzleRun } from "../script/drizzleRun.js";

export const initAnswer = async () => {
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

  // --- Prisma Installation ---
  if (answers.orm === "Prisma") {
    await prismaRun({
      authUi: answers.authUi,
      database: answers.database,
    });
  }

  // --- Drizzle Installation ---
  if (answers.orm === "Drizzle") {
    await drizzleRun(answers.authUi);
  }
};
