import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Semesters";

export const Route = createFileRoute("/hod/semesters")({
  head: () => ({ meta: [{ title: "Semester Management · HOD" }] }),
  component: Page,
});
