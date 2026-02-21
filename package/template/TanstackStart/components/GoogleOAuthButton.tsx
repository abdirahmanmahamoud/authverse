import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const GoogleOAuthButton = () => {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <Button
      className="w-full text-base flex items-center gap-2"
      variant="outline"
      onClick={signIn}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.7 1.23 9.2 3.64l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.2C12.43 13.02 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.64-.15-3.22-.43-4.76H24v9.02h12.95c-.56 3.01-2.24 5.56-4.78 7.28l7.73 5.99c4.51-4.18 7.08-10.35 7.08-17.53z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.2C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.79l7.97-6.2z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.73-5.99c-2.15 1.45-4.9 2.3-8.17 2.3-6.26 0-11.57-3.52-13.46-8.59l-7.97 6.2C6.51 42.62 14.62 48 24 48z"
        />
      </svg>

      <span>Sign in with Google</span>
    </Button>
  );
};

export default GoogleOAuthButton;
