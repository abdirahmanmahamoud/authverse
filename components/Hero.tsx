import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "./page-header";
import { Button } from "./ui/button";
import Link from "next/link";
import Announcement from "./Announcement";
import { GithubButton } from "./ui/GithubButton";
import CpoyBash from "./CpoyBash";

const Hero = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-[#020617] relative">
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)`,
        }}
      />
      <div
        className="absolute inset-0 z-0 block dark:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)`,
        }}
      />
      <div className="w-full h-[90vh] flex items-center justify-center z-10">
        <PageHeader className="z-10">
          <Announcement />
          <PageHeaderHeading className="max-w-4xl">
            Build Authentication the Modern Way.
          </PageHeaderHeading>
          <PageHeaderDescription className="max-w-5xl">
            Stop wasting time wiring auth from scratch. With Authverse, you get
            a fully generated authentication system Better Auth config, OAuth
            providers, database setup Prisma/Drizzle, and beautiful ShadCN
            screens. All done automatically with a single command.
          </PageHeaderDescription>
          <PageActions>
            <Button
              asChild
              size="sm"
              className="bg-linear-to-r from-blue-500 to-indigo-500 z-10"
            >
              <Link href="/docs">Get Started</Link>
            </Button>
            <GithubButton />
          </PageActions>
          {/*  npx authverse@latest init copy bash */}
          {/*  npx authverse@latest init copy powershell */}
          <CpoyBash />
        </PageHeader>
      </div>
    </div>
  );
};

export default Hero;
