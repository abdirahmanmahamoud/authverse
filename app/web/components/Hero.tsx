"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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
      {/* Background Gradient / Glow */}
      {/* Background Gradient / Glow */}
      <div className="absolute top-0 z-0 h-screen w-screen bg-white dark:bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(255,255,255,0))]" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 md:px-6 z-10 flex flex-col gap-12 items-center justify-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto"
        >
          <Link href="/docs/changelog">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Expanded OAuth Ecosystem
            </div>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
            Build Authentication the Modern Way.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stop wasting time wiring auth from scratch. With Authverse, you get
            a fully generated authentication system Better Auth config, OAuth
            providers, database setup Prisma/Drizzle, and beautiful ShadCN
            screens. All done automatically with a single command.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-4">
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
        </motion.div>

        {/* Code Snippet Box */}
        {/* Code Snippet Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="relative flex items-center justify-between p-2 pl-4 rounded-full bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm shadow-sm">
            <div className="font-mono text-sm text-neutral-600 dark:text-neutral-400 truncate pr-4">
              <span className="text-blue-600 dark:text-blue-400 mr-2">$</span>
              {command}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 shrink-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy command</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
