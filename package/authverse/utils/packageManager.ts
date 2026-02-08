import { execSync } from "child_process";

type PM = "npm" | "pnpm" | "yarn" | "bun";

export const getPackageManager = (): PM => {
  const ua = process.env.npm_config_user_agent || "";

  if (ua.includes("bun")) return "bun";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";

  return "pnpm";
};

const pm = getPackageManager();

export const packageManager = (pkg: string, dev = false) => {
  if (pm === "pnpm") {
    execSync(`pnpm add ${dev ? "-D " : ""}${pkg}`, { stdio: "inherit" });
  } else if (pm === "yarn") {
    execSync(`yarn add ${dev ? "--dev " : ""}${pkg}`, { stdio: "inherit" });
  } else if (pm === "bun") {
    execSync(`bun add ${dev ? "-d " : ""}${pkg}`, { stdio: "inherit" });
  } else {
    execSync(`npm install ${pkg} ${dev ? "--save-dev" : ""}`, {
      stdio: "inherit",
    });
  }
};

export const runCommand = (cmd: string) => {
  const pm = getPackageManager();

  if (pm === "pnpm") {
    execSync(`pnpm dlx ${cmd}`, { stdio: "inherit" });
  } else if (pm === "bun") {
    execSync(`bunx ${cmd}`, { stdio: "inherit" });
  } else if (pm === "yarn") {
    execSync(`yarn dlx ${cmd}`, { stdio: "inherit" });
  } else {
    execSync(`npx ${cmd}`, { stdio: "inherit" });
  }
};
