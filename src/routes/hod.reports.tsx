import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Reports";

export const Route = createFileRoute("/hod/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics · HOD" }] }),
  component: Page,
});
