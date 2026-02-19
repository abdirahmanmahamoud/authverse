"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const AppleOAuthButton = () => {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "apple",
    });
  };

  return (
    <Button
      className="w-full text-base flex items-center gap-2"
      variant="outline"
      onClick={signIn}
    >
      {/* Apple SVG Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.05 20.28c-.96.95-2.04 1.78-3.23 2.52-1.19.74-2.43 1.15-3.69 1.15-1.25 0-2.45-.4-3.57-1.15-1.12-.75-2.09-1.58-2.9-2.52-1.92-2.22-2.88-5.01-2.88-8.38 0-3.37.96-6.16 2.88-8.38.81-.94 1.78-1.77 2.9-2.52 1.12-.75 2.32-1.15 3.57-1.15 1.26 0 2.5.41 3.69 1.15 1.19.74 2.27 1.57 3.23 2.52l.25.26-.25.25c-.96.96-1.59 2.05-1.89 3.28-.3 1.23-.3 2.5 0 3.73.3 1.23.93 2.32 1.89 3.28l.25.25-.25.25zM12.12 0c.06.84-.13 1.68-.56 2.5-.43.82-1.01 1.54-1.71 2.14-.7.6-1.5 1.05-2.39 1.35-.89.3-1.82.4-2.77.3.06-.84.25-1.68.56-2.5.31-.82.89-1.54 1.59-2.14.7-.6 1.51-1.05 2.41-1.35.9-.3 1.83-.4 2.87-.3z" />
      </svg>

      <span>Sign in with Apple</span>
    </Button>
  );
};

export default AppleOAuthButton;
