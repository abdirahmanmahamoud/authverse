import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "./page-header";
import { Button } from "./ui/button";
import Link from "next/link";
import Announcement from "./Announcement";

const Hero = () => {
  return (
    <div className="w-full h-[90vh] flex items-center justify-center">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading className="max-w-4xl">
          Build Authentication the Modern Way.
        </PageHeaderHeading>
        <PageHeaderDescription className="max-w-5xl">
          Stop wasting time wiring auth from scratch. With Authverse, you get a
          fully generated authentication system Better Auth config, OAuth
          providers, database setup Prisma/Drizzle, and beautiful ShadCN
          screens. All done automatically with a single command.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/docs/changelog">View Changelog</Link>
          </Button>
        </PageActions>
      </PageHeader>
    </div>
  );
};

export default Hero;
