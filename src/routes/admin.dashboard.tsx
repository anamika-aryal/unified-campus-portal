import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/admin/pages/Dashboard";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Super Admin Dashboard · SMS" }] }),
  component: Page,
});
