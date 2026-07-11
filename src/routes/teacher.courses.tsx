import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { coursesFor } from "@/lib/mock-data";
import { DrillDown, BackToDrillDown, type DrillState } from "@/components/DrillDown";
import type { Course } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/courses")({
  head: () => ({ meta: [{ title: "My Courses · Teacher Portal" }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const [drill, setDrill] = useState<DrillState>({ dept: null, sem: null, section: null });
  const [detailsCourse, setDetailsCourse] = useState<Course | null>(null);

  const done = drill.dept && drill.sem !== null && drill.section;
  const assigned = done ? coursesFor(drill.dept!, drill.sem!, drill.section!) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">My Courses</h1>
        <p className="text-sm text-muted-foreground">Select a department, semester and section to view your assigned courses.</p>
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
                <Card key={c.id} className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-soft transition hover:-translate-y-1 hover:shadow-glass">
                  <div className="gradient-brand relative h-24 p-4 text-white">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{c.code}</div>
                    <div className="mt-1 font-display text-lg font-bold">{c.name}</div>
                    <div className="absolute right-4 top-4 rounded-lg bg-white/15 px-2 py-1 font-mono text-xs backdrop-blur">{c.credits} cr</div>
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <Stat label="Credit Hours" value={c.credits} />
                      <Stat label="Students" value={c.enrolled} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Attendance</span><span className="font-semibold">{c.attendance}%</span></div>
                      <Progress value={c.attendance} className="mt-1 h-1.5" />
                    </div>
                    <Button size="sm" className="w-full rounded-lg" onClick={() => setDetailsCourse(c)}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={!!detailsCourse} onOpenChange={(v) => !v && setDetailsCourse(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          {detailsCourse && (
            <>
              <DialogHeader>
                <DialogTitle>{detailsCourse.name}</DialogTitle>
                <DialogDescription>{detailsCourse.code} · Semester {detailsCourse.sem} · Section {detailsCourse.section}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Stat label="Course Name" value={detailsCourse.name} />
                <Stat label="Course Code" value={detailsCourse.code} />
                <Stat label="Credit Hours" value={detailsCourse.credits} />
                <Stat label="Attendance %" value={`${detailsCourse.attendance}%`} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-base font-bold">{value}</div>
    </div>
  );
}
