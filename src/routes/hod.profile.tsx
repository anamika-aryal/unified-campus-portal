import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Profile";

export const Route = createFileRoute("/hod/profile")({
  head: () => ({ meta: [{ title: "HOD Profile" }] }),
  component: Page,
});
