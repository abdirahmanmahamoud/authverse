import chalk from "chalk";
import { googleNext } from "../oauth/googleNext.js";
import { githubNext } from "../oauth/githubNext.js";
import { googleTanstackState } from "../oauth/googleTanstackState.js";
import { githubTanstackState } from "../oauth/githubTanstackState.js";
import { getFramework } from "../utils/framework.js";
import { facebookNext } from "../oauth/facebookNext.js";
import { facebookTanstackState } from "../oauth/facebookTanstackState.js";
import { LinkedInNext } from "../oauth/LinkedInNext.js";
import { LinkedInTanstackState } from "../oauth/LinkedInTanstackState.js";
import { twitterNext } from "../oauth/twitterNext.js";
import { twitterTanstackState } from "../oauth/twitterTanstackState.js";

export const Oauth = async ({ oauth }: { oauth: string }) => {
  try {
    const { framework, error } = await getFramework();

    if (error) {
      console.log(chalk.red(error));
      return;
    }

    if (framework === "Next js" && oauth == "google") {
      await googleNext();
    } else if (framework === "Next js" && oauth == "github") {
      await githubNext();
    }

    if (framework === "tanstack state" && oauth == "google") {
      await googleTanstackState();
    } else if (framework === "tanstack state" && oauth == "github") {
      await githubTanstackState();
    }

    if (framework === "Next js" && oauth == "facebook") {
      await facebookNext();
    } else if (framework === "tanstack state" && oauth == "facebook") {
      await facebookTanstackState();
    }

    if (framework === "Next js" && oauth === "LinkedIn") {
      await LinkedInNext();
    } else if (framework === "tanstack state" && oauth === "LinkedIn") {
      await LinkedInTanstackState();
    }

    if (framework === "Next js" && oauth === "twitter") {
      await twitterNext();
    } else if (framework === "tanstack state" && oauth === "twitter") {
      await twitterTanstackState();
    }

    if (
      oauth !== "google" &&
      oauth !== "github" &&
      oauth !== "facebook" &&
      oauth !== "LinkedIn" &&
      oauth !== "twitter"
    ) {
      console.log(chalk.red("Invalid oauth provider"));
      return;
    }
  } catch (error) {
    console.log(chalk.red("Error adding oauth:"), error);
  }
};
