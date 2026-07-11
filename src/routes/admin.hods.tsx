import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/admin/pages/Hods";

export const Route = createFileRoute("/admin/hods")({
  head: () => ({ meta: [{ title: "HOD Management · Super Admin" }] }),
  component: Page,
});
