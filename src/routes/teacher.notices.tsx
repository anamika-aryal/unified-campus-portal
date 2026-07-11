import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Notices";

export const Route = createFileRoute("/teacher/notices")({
  head: () => ({ meta: [{ title: "Notice · Teacher Portal" }] }),
  component: Page,
});
