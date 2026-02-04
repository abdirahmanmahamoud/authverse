"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so we can avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <Button variant="outline" size="icon">
        <div className="size-4" />
      </Button>
    );
  }

  const icon =
    theme === "dark" ? (
      <IconSun className="size-4" />
    ) : (
      <IconMoon className="size-4" />
    );

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {icon}
    </Button>
  );
};

export default ModeToggle;
