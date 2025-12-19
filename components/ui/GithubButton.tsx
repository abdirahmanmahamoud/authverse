"use client";

import Link from "next/link";
import { Button } from "./button";
import { Icons } from "../icons";
import { Suspense } from "react";
import { Skeleton } from "./skeleton";

export const GithubButton = () => {
  return (
    <Button
      asChild
      variant="outline"
      className="bg-transparent hover:bg-transparent border border-gray-400/45 dark:border-gray-700 shadow-2xl"
    >
      <Link
        href="https://github.com/abdirahmanmahamoud/authverse"
        target="_blank"
        rel="noreferrer"
      >
        <Icons.gitHub />
        <span className="ml-2">Star on GitHub</span>
        <Suspense fallback={<Skeleton className="w-8 h-4" />}>
          <StarsCount />
        </Suspense>
      </Link>
    </Button>
  );
};

export async function StarsCount() {
  const data = await fetch(
    "https://api.github.com/repos/abdirahmanmahamoud/authverse",
    {
      next: { revalidate: 86400 },
    }
  );
  const json = await data.json();

  const formattedCount =
    json.stargazers_count >= 1000
      ? `${Math.round(json.stargazers_count / 1000)}k`
      : json.stargazers_count.toLocaleString();

  return (
    <span className="text-muted-foreground w-fit text-sm tabular-nums">
      {formattedCount}
    </span>
  );
}
