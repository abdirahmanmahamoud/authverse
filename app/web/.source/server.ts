// @ts-nocheck
import * as __fd_glob_19 from "../content/docs/oauth/Twitter.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/oauth/LinkedIn.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/oauth/Google.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/oauth/Github.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/oauth/Facebook.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/oauth/Apple.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/integrations/tanstackstart.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/integrations/nextjs.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/integrations/Email.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/auth/forgetPassword.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/auth/email-verification.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/auth/credentials.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/(root)/installation.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/(root)/index.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/(root)/changelog.mdx?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/oauth/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/integrations/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/auth/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/(root)/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "(root)/meta.json": __fd_glob_1, "auth/meta.json": __fd_glob_2, "integrations/meta.json": __fd_glob_3, "oauth/meta.json": __fd_glob_4, }, {"(root)/changelog.mdx": __fd_glob_5, "(root)/index.mdx": __fd_glob_6, "(root)/installation.mdx": __fd_glob_7, "auth/credentials.mdx": __fd_glob_8, "auth/email-verification.mdx": __fd_glob_9, "auth/forgetPassword.mdx": __fd_glob_10, "integrations/Email.mdx": __fd_glob_11, "integrations/nextjs.mdx": __fd_glob_12, "integrations/tanstackstart.mdx": __fd_glob_13, "oauth/Apple.mdx": __fd_glob_14, "oauth/Facebook.mdx": __fd_glob_15, "oauth/Github.mdx": __fd_glob_16, "oauth/Google.mdx": __fd_glob_17, "oauth/LinkedIn.mdx": __fd_glob_18, "oauth/Twitter.mdx": __fd_glob_19, });