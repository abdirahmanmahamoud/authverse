import SingUpComponent from "@/components/authverse/SingUpComponent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-800">
      <SingUpComponent />
    </div>
  );
}
