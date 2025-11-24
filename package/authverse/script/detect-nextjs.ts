import { existsSync, readFileSync } from "fs";

export function isNextJsProject() {
  if (!existsSync("./package.json")) return false;

  try {
    const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    return deps["next"] !== undefined;
  } catch (err) {
    return false;
  }
}
