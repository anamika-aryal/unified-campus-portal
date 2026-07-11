import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/AttendanceIndex";

export const Route = createFileRoute("/teacher/attendance/")({
  head: () => ({ meta: [{ title: "Attendance · Teacher Portal" }] }),
  component: Page,
});
