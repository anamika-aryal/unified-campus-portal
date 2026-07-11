import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { FileBarChart, Download, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";
import { coursesFor, studentsFor, internalTotal, defaultMarksEntry, TOTAL_INTERNAL_MAX, type Course } from "@/lib/mock-data";
import { DrillDown, BackToDrillDown, type DrillState } from "@/components/DrillDown";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({ meta: [{ title: "Reports · Teacher Portal" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [drill, setDrill] = useState<DrillState>({ dept: null, sem: null, section: null });
  const [course, setCourse] = useState<Course | null>(null);

  const done = drill.dept && drill.sem !== null && drill.section;
  const assigned = done ? coursesFor(drill.dept!, drill.sem!, drill.section!) : [];

  if (course) {
    return <ReportScreen course={course} onBack={() => setCourse(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Select a department, semester and section, then a course to generate its internal marks report.</p>
      </div>

      <DrillDown value={drill} onChange={setDrill} />

      {done && (
        <>
          <BackToDrillDown label="Change Section" onClick={() => setDrill((d) => ({ ...d, section: null }))} />
          {assigned.length === 0 ? (
            <Card className="rounded-2xl p-8 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">No courses assigned to this section.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {assigned.map((c) => (
                <Card key={c.id} className="rounded-2xl shadow-soft transition hover:-translate-y-1 hover:shadow-glass">
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-white"><FileBarChart className="h-5 w-5" /></div>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{c.code} · Internal Marks Report</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full rounded-xl" onClick={() => setCourse(c)}>Generate Report</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReportScreen({ course, onBack }: { course: Course; onBack: () => void }) {
  const roster = useMemo(
    () => studentsFor(course.id, 12).map((s) => ({ ...s, marksEntry: defaultMarksEntry() })),
    [course.id],
  );

  const [generating, setGenerating] = useState<"excel" | "pdf" | null>(null);
  const [successFormat, setSuccessFormat] = useState<"excel" | "pdf" | null>(null);

  function download(format: "excel" | "pdf") {
    setGenerating(format);
    setTimeout(() => {
      setGenerating(null);
      setSuccessFormat(format);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BackToDrillDown label="Back" onClick={onBack} />
          <div>
            <h1 className="font-display text-2xl font-bold">{course.name} · Internal Marks Report</h1>
            <p className="text-sm text-muted-foreground">{course.code} · Semester {course.sem} · Section {course.section}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" disabled={!!generating} onClick={() => download("excel")}>
            {generating === "excel" ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-1.5 h-4 w-4" />}
            Download Excel
          </Button>
          <Button className="rounded-xl" disabled={!!generating} onClick={() => download("pdf")}>
            {generating === "pdf" ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />}
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="pb-2"><CardTitle className="text-base">Internal Marks Summary /{TOTAL_INTERNAL_MAX}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
                  <th>Student</th><th>Enrollment</th><th>Total /{TOTAL_INTERNAL_MAX}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roster.map((s) => (
                  <tr key={s.id} className="[&>td]:px-4 [&>td]:py-2.5">
                    <td className="font-medium">{s.name}</td>
                    <td className="text-muted-foreground">{s.enrollment}</td>
                    <td>
                      <span className="rounded-lg bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                        {internalTotal(s.marksEntry).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!successFormat} onOpenChange={(v) => !v && setSuccessFormat(null)}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <DialogHeader className="items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle>{successFormat === "excel" ? "Excel file generated" : "PDF generated"}</DialogTitle>
            <DialogDescription>
              The internal marks report for {course.name} has been downloaded as a {successFormat === "excel" ? ".xlsx" : "PDF"} file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button className="rounded-xl" onClick={() => setSuccessFormat(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
