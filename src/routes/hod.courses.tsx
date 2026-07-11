import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Courses";

export const Route = createFileRoute("/hod/courses")({
  head: () => ({ meta: [{ title: "Course Management · HOD" }] }),
  component: Page,
});
