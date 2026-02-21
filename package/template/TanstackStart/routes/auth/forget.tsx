import ForgetComponent from "@/components/authverse/ForgetComponent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/forget")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-800">
      <ForgetComponent />
    </div>
  );
}
