import chalk from "chalk";
import { packageManager, runCommand } from "../utils/packageManager.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const shadcnComponents = [
  "button.tsx",
  "card.tsx",
  "field.tsx",
  "input.tsx",
  "label.tsx",
  "separator.tsx",
  "sonner.tsx",
];

export const authUiTanstackState = async ({
  packageJson,
  cmd,
}: {
  packageJson: any;
  cmd: boolean;
}) => {
  try {
    const projectDir = process.cwd();

    // check if shadcn ui is already installed
    const shadcnPath = path.join(projectDir, "src", "components", "ui");

    // shadcn config file
    const shadcnConfigPath = path.join(projectDir, "components.json");

    if (!fs.existsSync(shadcnPath) || !fs.existsSync(shadcnConfigPath)) {
      console.log(chalk.yellow("\n Installing shadcn ui Components\n"));
      if (cmd == true) {
        runCommand("shadcn@latest init --base-color zinc --yes");
        runCommand("shadcn@latest add button sonner card field input");
      } else {
        runCommand("shadcn@latest add button sonner card field input");
      }
    }
    // list all files in shadcnPath
    const shadcnFiles = fs.readdirSync(shadcnPath);

    // Find missing components
    const missingComponents = shadcnComponents.filter(
      (component) => !shadcnFiles.includes(component),
    );

    if (missingComponents.length > 0) {
      console.log(chalk.yellow("\n Installing shadcn ui Components\n"));
      const install = missingComponents
        .map((components) => components.split(".")[0])
        .join(" ");
      runCommand(`shadcn@latest add ${install}`);
    }

    if (
      !packageJson.dependencies?.["@tanstack/react-form"] ||
      !packageJson.dependencies?.["zod"]
    ) {
      packageManager("@tanstack/react-form zod");
    }

    //  Fix for __dirname in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // src folder & Get project directory
    const srcPath = path.join(projectDir, "src");

    const componentPath = path.resolve(
      __dirname,
      "./template/TanstackState/components",
    );

    // Copy component files
    const authversePathComponents = path.join(
      srcPath,
      "components",
      "authverse",
    );

    if (!fs.existsSync(authversePathComponents)) {
      fs.mkdirSync(authversePathComponents, { recursive: true });
    }

    fs.copyFileSync(
      `${componentPath}/LoginComponent.tsx`,
      path.join(authversePathComponents, "LoginComponent.tsx"),
    );

    fs.copyFileSync(
      `${componentPath}/SingUpComponent.tsx`,
      path.join(authversePathComponents, "SingUpComponent.tsx"),
    );

    // create routes page
    const pageRoutesPath = path.join(`${srcPath}/routes`, "auth");
    if (!fs.existsSync(pageRoutesPath)) {
      fs.mkdirSync(pageRoutesPath, { recursive: true });
    }

    // template routes page
    const templateRoutesPage = path.resolve(
      __dirname,
      "./template/TanstackState/routes/auth",
    );

    fs.copyFileSync(
      `${templateRoutesPage}/login.tsx`,
      path.join(pageRoutesPath, "login.tsx"),
    );

    fs.copyFileSync(
      `${templateRoutesPage}/signup.tsx`,
      path.join(pageRoutesPath, "signup.tsx"),
    );

    // Add Toaster __root.tsx
    const rootPath = path.join(projectDir, "src/routes", "__root.tsx");
    if (fs.existsSync(rootPath)) {
      let rootContent = fs.readFileSync(rootPath, "utf-8");

      if (!rootContent.includes("Toaster")) {
        rootContent = `import { Toaster } from "@/components/ui/sonner";\n${rootContent}`;
      }

      if (!rootContent.includes("<Toaster")) {
        rootContent = rootContent.replace(
          /<\/body>/,
          "    <Toaster />\n  </body>",
        );
      }

      fs.writeFileSync(rootPath, rootContent, "utf-8");
    }

    console.log(chalk.green("\nSetup completed!\n"));
  } catch (error) {
    console.log(chalk.red("Auth Ui Tanstack State Error: ", error));
  }
};
