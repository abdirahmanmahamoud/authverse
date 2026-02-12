import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const githubNext = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const projectDir = process.cwd();

    // detect src folder
    const srcPath = path.join(projectDir, "src");
    const folder = fs.existsSync(srcPath) ? "src" : "";

    const authFilePath = path.join(projectDir, folder, "lib", "auth.ts");

    if (!fs.existsSync(authFilePath)) {
      console.log(chalk.red("auth.ts file not found"));
      return;
    }

    let content = fs.readFileSync(authFilePath, "utf8");

    if (!content.includes("betterAuth({")) {
      console.log(chalk.red("betterAuth({}) block not found"));
      return;
    }

    // prevent duplicate
    if (content.includes("socialProviders") && content.includes("github:")) {
      console.log(chalk.yellow("GitHub provider already exists"));
      return;
    }

    const githubProviderEntry = `
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },`;

    // CASE 1: socialProviders already exists → merge
    if (content.includes("socialProviders: {")) {
      const start = content.indexOf("socialProviders: {");
      let braceCount = 0;
      let insertPos = -1;

      for (let i = start; i < content.length; i++) {
        if (content[i] === "{") braceCount++;
        if (content[i] === "}") {
          braceCount--;
          if (braceCount === 0) {
            insertPos = i;
            break;
          }
        }
      }

      if (insertPos === -1) {
        console.log(chalk.red("Failed to parse socialProviders block"));
        return;
      }

      content =
        content.slice(0, insertPos) +
        githubProviderEntry +
        "\n  " +
        content.slice(insertPos);
    } else {
      // CASE 2: socialProviders does NOT exist → create after database
      const databaseRegex =
        /database:\s*(prismaAdapter|drizzleAdapter)\([\s\S]*?\),/;

      if (!databaseRegex.test(content)) {
        console.log(
          chalk.red(
            "Could not find database adapter (prismaAdapter or drizzleAdapter)",
          ),
        );
        return;
      }

      const socialProvidersBlock = `
  socialProviders: {
${githubProviderEntry}
  },`;

      content = content.replace(
        databaseRegex,
        (match) => `${match}\n${socialProvidersBlock}`,
      );
    }

    fs.writeFileSync(authFilePath, content, "utf8");

    // .env
    const envPath = path.join(projectDir, ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      if (!envContent.includes("GITHUB_CLIENT_ID")) {
        fs.appendFileSync(
          envPath,
          `\n\n# GitHub OAuth\nGITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET=\n`,
        );
      }
    }

    // Copy GithubProviders.ts
    const componentTemplate = path.resolve(
      __dirname,
      "./template/components/GithubProviders.tsx",
    );

    const componentsDir = path.join(
      projectDir,
      folder,
      "components",
      "authverse",
    );

    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    const componentDest = path.join(componentsDir, "GithubProviders.tsx");

    if (fs.existsSync(componentTemplate)) {
      fs.copyFileSync(componentTemplate, componentDest);
    }

    console.log(chalk.green("GitHub provider added & merged successfully"));
  } catch (error) {
    console.log(chalk.red("githubRun error:"), error);
  }
};
