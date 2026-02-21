import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const TwitterOAuthButton = () => {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "twitter",
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
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
      </svg>

      <span>Sign in with twitter(x)</span>
    </Button>
  );
};

export default TwitterOAuthButton;
