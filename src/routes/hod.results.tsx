import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Results";

export const Route = createFileRoute("/hod/results")({
  head: () => ({ meta: [{ title: "Result Monitoring · HOD" }] }),
  component: Page,
});
