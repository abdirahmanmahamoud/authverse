import path from "path";
import fs from "fs";

type returnFramework = {
  framework: "Next js" | "tanstack start" | null;
  error: string | null;
};

export const getFramework = async (): Promise<returnFramework> => {
  const projectDir = process.cwd();

  // check file package.json
  if (!fs.existsSync(path.join(projectDir, "package.json"))) {
    return {
      framework: null,
      error: "No framework detected",
    };
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectDir, "package.json"), "utf-8"),
  );

  // check framework Next js
  const hasNext =
    packageJson?.dependencies?.["next"] ||
    packageJson?.devDependencies?.["next"];

  if (hasNext) {
    return {
      framework: "Next js",
      error: null,
    };
  }

  // check framework tanstack state
  const hasTanstackState =
    packageJson?.devDependencies?.["@tanstack/devtools-vite"] ||
    packageJson?.devDependencies?.["@tanstack/eslint-config"] ||
    packageJson?.devDependencies?.["@tanstack/react-start"];

  if (hasTanstackState) {
    return {
      framework: "tanstack start",
      error: null,
    };
  }

  return {
    framework: null,
    error: "No framework supported authverse",
  };
};
