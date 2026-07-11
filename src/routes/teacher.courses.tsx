import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Courses";

export const Route = createFileRoute("/teacher/courses")({
  head: () => ({ meta: [{ title: "My Courses · Teacher Portal" }] }),
  component: Page,
});
