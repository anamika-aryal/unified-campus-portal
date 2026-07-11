import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Settings";

export const Route = createFileRoute("/hod/settings")({
  head: () => ({ meta: [{ title: "Settings · HOD" }] }),
  component: Page,
});
