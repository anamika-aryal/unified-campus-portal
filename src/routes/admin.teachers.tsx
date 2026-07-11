import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/admin/pages/Teachers";

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Teacher Management · Super Admin" }] }),
  component: Page,
});
