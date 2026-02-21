import ResetComponent from "@/components/authverse/ResetComponent";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: z.object({
    token: z.string(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-800">
      <ResetComponent />
    </div>
  );
}
