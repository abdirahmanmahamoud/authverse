"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };
  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOutIcon className="mr-1 h-4 w-4" />
      Logout
    </Button>
  );
};

export default Logout;
