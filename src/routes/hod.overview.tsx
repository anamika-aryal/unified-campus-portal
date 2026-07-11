import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Overview";

export const Route = createFileRoute("/hod/overview")({
  head: () => ({ meta: [{ title: "Department Overview · HOD" }] }),
  component: Page,
});
