// @ts-nocheck
import * as __fd_glob_9 from "../content/docs/auth/GoogleOAuth.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/auth/GithubOAuth.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/auth/forgetPassword.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/auth/credentials.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/(root)/installation.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/(root)/index.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/(root)/changelog.mdx?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/auth/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/(root)/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "(root)/meta.json": __fd_glob_1, "auth/meta.json": __fd_glob_2, }, {"(root)/changelog.mdx": __fd_glob_3, "(root)/index.mdx": __fd_glob_4, "(root)/installation.mdx": __fd_glob_5, "auth/credentials.mdx": __fd_glob_6, "auth/forgetPassword.mdx": __fd_glob_7, "auth/GithubOAuth.mdx": __fd_glob_8, "auth/GoogleOAuth.mdx": __fd_glob_9, });