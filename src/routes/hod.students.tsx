import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Students";

export const Route = createFileRoute("/hod/students")({
  head: () => ({ meta: [{ title: "Student Management · HOD" }] }),
  component: Page,
});
