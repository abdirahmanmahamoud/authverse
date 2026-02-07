import chalk from "chalk";
import { getFramework } from "../utils/framework.js";
import { prismaRun } from "../script/prisma.js";
import { prismaRunTanstackState } from "../script/prismaRunTanstackState.js";
import { drizzleRun } from "../script/drizzleRun.js";
import { drizzleRunTanstackState } from "../script/drizzleRunTanstackState.js";

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
      });
    }
    // nextjs or Drizzle Installation
    if (framework === "Next js" && cmd.orm === "drizzle") {
      await drizzleRun(cmd.authUi === "yes" ? true : false);
    }

    // tanstack state or Prisma Installation
    if (framework === "tanstack state" && cmd.orm === "prisma") {
      await prismaRunTanstackState({
        authUi: cmd.authUi === "yes" ? true : false,
        database: cmd.db,
      });
    }

    // tanstack state or Drizzle Installation
    if (framework === "tanstack state" && cmd.orm === "drizzle") {
      await drizzleRunTanstackState(cmd.authUi === "yes" ? true : false);
    }
  } catch (error: any) {
    console.log(chalk.red(error));
  }
};
