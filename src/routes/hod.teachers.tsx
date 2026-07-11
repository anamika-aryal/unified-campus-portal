import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Teachers";

export const Route = createFileRoute("/hod/teachers")({
  head: () => ({ meta: [{ title: "Teacher Management · HOD" }] }),
  component: Page,
});
