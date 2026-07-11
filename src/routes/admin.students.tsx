import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/admin/pages/Students";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "View Students · Super Admin" }] }),
  component: Page,
});
