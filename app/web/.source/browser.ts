// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"(root)/changelog.mdx": () => import("../content/docs/(root)/changelog.mdx?collection=docs"), "(root)/index.mdx": () => import("../content/docs/(root)/index.mdx?collection=docs"), "(root)/installation.mdx": () => import("../content/docs/(root)/installation.mdx?collection=docs"), "auth/credentials.mdx": () => import("../content/docs/auth/credentials.mdx?collection=docs"), "auth/email-verification.mdx": () => import("../content/docs/auth/email-verification.mdx?collection=docs"), "auth/forgetPassword.mdx": () => import("../content/docs/auth/forgetPassword.mdx?collection=docs"), "auth/GithubOAuth.mdx": () => import("../content/docs/auth/GithubOAuth.mdx?collection=docs"), "auth/GoogleOAuth.mdx": () => import("../content/docs/auth/GoogleOAuth.mdx?collection=docs"), "integrations/Email.mdx": () => import("../content/docs/integrations/Email.mdx?collection=docs"), "integrations/nextjs.mdx": () => import("../content/docs/integrations/nextjs.mdx?collection=docs"), "integrations/tanstackstart.mdx": () => import("../content/docs/integrations/tanstackstart.mdx?collection=docs"), }),
};
export default browserCollections;