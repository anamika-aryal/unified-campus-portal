import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Marks";

export const Route = createFileRoute("/hod/marks")({
  head: () => ({ meta: [{ title: "Internal Marks Monitoring · HOD" }] }),
  component: Page,
});
