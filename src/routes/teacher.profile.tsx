import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Profile";

export const Route = createFileRoute("/teacher/profile")({
  head: () => ({ meta: [{ title: "My Profile · Teacher Portal" }] }),
  component: Page,
});
