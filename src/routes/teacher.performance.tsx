import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Performance";

export const Route = createFileRoute("/teacher/performance")({
  head: () => ({ meta: [{ title: "Student Performance · Teacher Portal" }] }),
  component: Page,
});
