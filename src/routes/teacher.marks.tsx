import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/teacher/pages/Marks";

export const Route = createFileRoute("/teacher/marks")({
  head: () => ({ meta: [{ title: "Internal Marks · Teacher Portal" }] }),
  component: Page,
});
