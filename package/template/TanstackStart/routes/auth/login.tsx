import LoginComponent from "@/components/authverse/LoginComponent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-800">
      <LoginComponent />
    </div>
  );
}
