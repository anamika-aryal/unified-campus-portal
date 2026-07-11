import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/admin/pages/Settings";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "System Settings · Super Admin" }] }),
  component: Page,
});
