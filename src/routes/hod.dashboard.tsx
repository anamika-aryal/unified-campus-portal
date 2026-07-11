import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Dashboard";

export const Route = createFileRoute("/hod/dashboard")({
  head: () => ({ meta: [{ title: "HOD Dashboard · Comp. Engg." }] }),
  component: Page,
});
