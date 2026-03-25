"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "./icons";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const GithubStars = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/abdirahmanmahamoud/authverse")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="bg-background dark:bg-[#000000] relative overflow-hidden transition-colors duration-300 py-16 md:py-24">
      <div className="px-6 lg:px-16 mx-auto relative z-10 max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-2xl transition-shadow duration-300 hover:shadow-blue-500/5">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

          <div className="relative p-8 md:p-16 flex flex-col items-center text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white shadow-inner mb-2">
              <Icons.gitHub className="w-8 h-8" />
            </div>

            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                Proudly Open Source
              </h2>
              <p className="text-lg text-gray-600 dark:text-neutral-400 leading-relaxed">
                Authverse is completely open source and driven by the community.
                Check out the repository, contribute to the codebase, or leave a
                star if you find it useful.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 shadow-xl px-8 gap-2 rounded-full"
              >
                <Link
                  href="https://github.com/abdirahmanmahamoud/authverse"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="h-5 w-5" />
                  Star on GitHub
                  <div className="ml-2 flex items-center pl-3 border-l border-gray-700 dark:border-gray-300">
                    <Star className="w-4 h-4 mr-1.5 fill-current" />
                    <span className="font-semibold">
                      {stars?.toLocaleString()} Stars
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GithubStars;
