import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Attendance";

export const Route = createFileRoute("/hod/attendance")({
  head: () => ({ meta: [{ title: "Attendance Monitoring · HOD" }] }),
  component: Page,
});
