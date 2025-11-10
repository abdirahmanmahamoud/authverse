import inquirer from "inquirer";
import chalk from "chalk";
import { prismaRun } from "../script/prisma.js";
import { authUiRun } from "../script/authUi.js";

export const initAnswer = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "database",
      message: "Choose your database:",
      choices: ["Prisma", "Drizzle"],
    },
    {
      type: "confirm",
      name: "authUi",
      message: "Do you want to include auth UI design?",
      default: true,
    },
  ]);

  // --- Prisma Installation ---
  if (answers.database === "Prisma") {
    await prismaRun(answers.authUi);
  }
};
