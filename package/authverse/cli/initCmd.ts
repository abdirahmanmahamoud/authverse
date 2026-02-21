import chalk from "chalk";
import { getFramework } from "../utils/framework.js";
import { prismaRun } from "../script/prisma.js";
import { prismaRunTanstackStart } from "../script/prismaRunTanstackStart.js";
import { drizzleRun } from "../script/drizzleRun.js";
import { drizzleRunTanstackStart } from "../script/drizzleRunTanstackStart.js";

export type cmdType = {
  orm: "prisma" | "drizzle";
  db: "Postgresql" | "Mongodb" | "Mysql";
  authUi: "yes" | "no";
};

export const initCmd = async (cmd: cmdType) => {
  try {
    const { framework, error } = await getFramework();

    if (error) {
      console.log(chalk.red(error));
      return;
    }

    // next js prisma
    if (framework === "Next js" && cmd.orm === "prisma") {
      await prismaRun({
        database: cmd.db,
        authUi: cmd.authUi === "yes" ? true : false,
        cmd: true,
      });
    }
    // nextjs or Drizzle Installation
    if (framework === "Next js" && cmd.orm === "drizzle") {
      await drizzleRun({
        authUi: cmd.authUi === "yes" ? true : false,
        cmd: true,
      });
    }

    // tanstack start or Prisma Installation
    if (framework === "tanstack start" && cmd.orm === "prisma") {
      await prismaRunTanstackStart({
        authUi: cmd.authUi === "yes" ? true : false,
        database: cmd.db,
        cmd: true,
      });
    }

    // tanstack start or Drizzle Installation
    if (framework === "tanstack start" && cmd.orm === "drizzle") {
      await drizzleRunTanstackStart({
        authUi: cmd.authUi === "yes" ? true : false,
        cmd: true,
      });
    }
  } catch (error: any) {
    console.log(chalk.red(error));
  }
};
