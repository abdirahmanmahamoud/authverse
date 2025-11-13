"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";

const GoogleProviders = () => {
  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };
  return (
    <Button className="w-full text-base" variant="outline" onClick={signIn}>
      <FaGoogle />
      Sign in with Google
    </Button>
  );
};

export default GoogleProviders;
