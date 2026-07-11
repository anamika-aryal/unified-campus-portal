import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Dashboard";

export const Route = createFileRoute("/teacher/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Teacher Portal" }] }),
  component: Page,
});
