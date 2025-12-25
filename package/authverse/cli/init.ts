import inquirer from "inquirer";
import { prismaRun } from "../script/prisma.js";
import { drizzleRun } from "../script/drizzleRun.js";
import path from "path";
import fs from "fs";

export const initAnswer = async () => {
  const projectDir = process.cwd();
  const packageJsonPath = path.join(projectDir, "package.json");

  // -----------------------------
  // Auto detect framework
  // -----------------------------
  let framework: "Next js" | "tanstack state" = "tanstack state";

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const hasNext =
      packageJson?.dependencies?.["next"] ||
      packageJson?.devDependencies?.["next"];

    framework = hasNext ? "Next js" : "tanstack state";
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
    console.log("tanstack state or Prisma Installation");
  }

  // tanstack state or Drizzle Installation
  if (framework === "tanstack state" && answers.orm === "Drizzle") {
    console.log("tanstack state or Drizzle Installation");
  }
};
