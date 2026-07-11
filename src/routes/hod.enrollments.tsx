import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Enrollments";

export const Route = createFileRoute("/hod/enrollments")({
  head: () => ({ meta: [{ title: "Enrollment Approval · HOD" }] }),
  component: Page,
});
