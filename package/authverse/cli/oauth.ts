import chalk from "chalk";
import { googleNext } from "../oauth/googleNext.js";
import { githubNext } from "../oauth/githubNext.js";
import { googleTanstackStart } from "../oauth/googleTanstackStart.js";
import { githubTanstackStart } from "../oauth/githubTanstackStart.js";
import { getFramework } from "../utils/framework.js";
import { facebookNext } from "../oauth/facebookNext.js";
import { facebookTanstackStart } from "../oauth/facebookTanstackStart.js";
import { LinkedInNext } from "../oauth/LinkedInNext.js";
import { LinkedInTanstackStart } from "../oauth/LinkedInTanstackStart.js";
import { twitterNext } from "../oauth/twitterNext.js";
import { twitterTanstackStart } from "../oauth/twitterTanstackStart.js";

import { AppleNext } from "../oauth/AppleNext.js";
import { AppleTanstackStart } from "../oauth/AppleTanstackStart.js";

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

    if (framework === "tanstack start" && oauth == "google") {
      await googleTanstackStart();
    } else if (framework === "tanstack start" && oauth == "github") {
      await githubTanstackStart();
    }

    if (framework === "Next js" && oauth == "facebook") {
      await facebookNext();
    } else if (framework === "tanstack start" && oauth == "facebook") {
      await facebookTanstackStart();
    }

    if (framework === "Next js" && oauth === "LinkedIn") {
      await LinkedInNext();
    } else if (framework === "tanstack start" && oauth === "LinkedIn") {
      await LinkedInTanstackStart();
    }

    if (framework === "Next js" && oauth === "twitter") {
      await twitterNext();
    } else if (framework === "tanstack start" && oauth === "twitter") {
      await twitterTanstackStart();
    }

    if (framework === "Next js" && oauth === "apple") {
      await AppleNext();
    } else if (framework === "tanstack start" && oauth === "apple") {
      await AppleTanstackStart();
    }

    if (
      oauth !== "google" &&
      oauth !== "github" &&
      oauth !== "facebook" &&
      oauth !== "LinkedIn" &&
      oauth !== "twitter" &&
      oauth !== "apple"
    ) {
      console.log(chalk.red("Invalid oauth provider"));
      return;
    }
  } catch (error) {
    console.log(chalk.red("Error adding oauth:"), error);
  }
};
