"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useState } from "react";
import { CheckIcon } from "lucide-react";

const CopyBash = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npx authverse@latest init");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="flex items-center gap-2 bg-gray-100/85 border border-gray-400/45 dark:border-gray-700 shadow-2xl"
      onClick={handleCopy}
    >
      <span className="pr-4 text-sm font-mono">npx authverse@latest init</span>

      {copied ? (
        <CheckIcon className="w-4 h-4" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </Button>
  );
};

export default CopyBash;
