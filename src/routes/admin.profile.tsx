import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/admin/pages/Profile";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Super Admin Profile" }] }),
  component: Page,
});
