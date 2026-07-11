import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/TakeAttendance";

export const Route = createFileRoute("/teacher/attendance/$courseId")({
  head: () => ({ meta: [{ title: "Take Attendance · Teacher Portal" }] }),
  component: Page,
});
