import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
// @ts-ignore jsx module
import DashboardShell from "@/components/student-layout/DashboardShell.jsx";
// @ts-ignore jsx module
import { studentModule } from "@/features/student/index.js";

export const Route = createFileRoute("/student/$page")({
  component: StudentRoute,
});

function StudentRoute() {
  const { page } = Route.useParams();
  const navigate = useNavigate();
  const pageId = studentModule.pages[page as keyof typeof studentModule.pages]
    ? page
    : studentModule.defaultPage;
  const ActivePage = studentModule.pages[pageId as keyof typeof studentModule.pages];
  const currentItem = studentModule.nav
    .flatMap((s: any) => s.items)
    .find((i: any) => i.id === pageId);
  const breadcrumb = currentItem?.breadcrumb ?? ["Student"];

  return (
    <DashboardShell
      nav={studentModule.nav}
      activeId={pageId}
      onNavigate={(id: string) => navigate({ to: "/student/$page", params: { page: id } })}
      breadcrumb={breadcrumb}
      user={studentModule.user}
      brandLabel={studentModule.label}
    >
      {ActivePage ? <ActivePage /> : null}
    </DashboardShell>
  );
}
