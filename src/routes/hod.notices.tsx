import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Notices";

export const Route = createFileRoute("/hod/notices")({
  head: () => ({ meta: [{ title: "Department Notices · HOD" }] }),
  component: Page,
});
