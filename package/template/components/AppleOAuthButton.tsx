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
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.365 1.43c0 1.14-.46 2.22-1.22 3.03-.8.84-2.1 1.49-3.2 1.4-.14-1.11.4-2.29 1.17-3.09.79-.83 2.14-1.44 3.25-1.34zM21.54 17.21c-.56 1.3-.83 1.88-1.55 3.02-1 1.56-2.4 3.5-4.13 3.52-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.05-1.78-4.05-3.34-2.8-4.33-3.09-9.4-1.36-12.02 1.23-1.86 3.18-2.96 5.02-2.96 1.87 0 3.05 1.03 4.6 1.03 1.5 0 2.42-1.03 4.59-1.03 1.64 0 3.38.9 4.61 2.44-4.05 2.22-3.39 8.01.37 9.34z" />
      </svg>

      <span>Sign in with Apple</span>
    </Button>
  );
};

export default AppleOAuthButton;
