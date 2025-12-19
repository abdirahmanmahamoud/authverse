"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { Icons } from "./icons";

const GithubRepo = () => {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link
        href="https://github.com/abdirahmanmahamoud/authverse"
        target="_blank"
        rel="noreferrer"
      >
        <Icons.gitHub />
      </Link>
    </Button>
  );
};

export default GithubRepo;
