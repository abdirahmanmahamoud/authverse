import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const GithubOAuthButton = () => {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };

  return (
    <Button
      className="w-full text-base flex items-center gap-2"
      variant="outline"
      onClick={signIn}
    >
      {/* GitHub SVG Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black dark:text-white"
      >
        <path d="M12 .5C5.73.5.5 5.74.5 12.03c0 5.13 3.29 9.47 7.86 11 .58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.75 1.19 1.75 1.19 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.19.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.57.23 2.73.11 3.02.74.81 1.19 1.85 1.19 3.11 0 4.43-2.69 5.4-5.25 5.68.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56 4.57-1.53 7.85-5.87 7.85-11C23.5 5.74 18.27.5 12 .5z" />
      </svg>

      <span>Sign in with GitHub</span>
    </Button>
  );
};

export default GithubOAuthButton;
