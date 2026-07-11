import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Reports";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({ meta: [{ title: "Reports · Teacher Portal" }] }),
  component: Page,
});
