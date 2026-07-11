import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/hod/pages/Calendar";

export const Route = createFileRoute("/hod/calendar")({
  head: () => ({ meta: [{ title: "Academic Calendar · HOD" }] }),
  component: Page,
});
