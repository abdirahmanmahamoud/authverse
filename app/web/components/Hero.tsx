"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Hero = () => {
  const [copied, setCopied] = useState(false);
  const command = "npx authverse@latest init";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-background text-foreground dark:text-white flex items-center justify-center overflow-hidden transition-colors duration-300">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 animate-gradient-xy"
          style={{
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-16 z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center justify-between">
        {/* Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 max-w-2xl mx-auto lg:mx-0">
          {/* Status Badge */}
          <Link href="/docs/changelog">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Expanded OAuth Ecosystem
            </div>
          </Link>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
            Build Authentication the Modern Way
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stop building auth from scratch. With Authverse, you get a complete
            setup Better Auth config, OAuth providers, Prisma/Drizzle database,
            and clean Shadcn/ui{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              all generated with one command.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-2">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-8"
            >
              <Link href="/docs/installation">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800 dark:hover:border-gray-600 px-8"
            >
              <Link href="/docs">View Docs</Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Setup Steps Box */}
        <div className="w-full max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
          <div className="relative group">
            {/* Glow Effect Removed */}

            {/* Steps Card */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-gray-200 dark:border-neutral-800 shadow-2xl backdrop-blur-xl">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Quick Start
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                  Get your authentication system up and running in minutes for
                  Next.js and TanStack Start.
                </p>
              </div>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm shrink-0 shadow-inner">
                    1
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Run Authverse init
                    </p>
                    <div className="relative flex items-center justify-between p-2 pl-4 rounded-xl bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/5">
                      <div className="flex items-center gap-3 overflow-x-auto">
                        <Terminal className="h-4 w-4 text-primary shrink-0" />
                        <code className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                          <span className="text-primary font-bold mr-2">$</span>
                          {command}
                        </code>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 ml-2 shrink-0 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="ml-4 w-0.5 h-6 bg-gray-200 dark:bg-neutral-800 -my-3" />

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm shrink-0 shadow-inner">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center flex-wrap gap-2">
                      Update the .env file
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1.5">
                      Add database connection variables and set up OAuth
                      credentials.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="ml-4 w-0.5 h-6 bg-gray-200 dark:bg-neutral-800 -my-3" />

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm shrink-0 shadow-inner">
                    3
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white pt-1">
                      Pull database schema
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1.5">
                      Run the following command to push the database schema
                      using Prisma or Drizzle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
