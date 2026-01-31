import path from "path";
import fs from "fs";

export const getFramework = async () => {
  const projectDir = process.cwd();

  // check file package.json
  if (!fs.existsSync(path.join(projectDir, "package.json"))) {
    return {
      framework: "",
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
      framework: "tanstack state",
      error: null,
    };
  }

  return {
    framework: "",
    error: "No framework supported authverse",
  };
};
