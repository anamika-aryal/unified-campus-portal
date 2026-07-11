import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ArrowRight } from "lucide-react";
import { coursesFor } from "@/lib/mock-data";
import { DrillDown, BackToDrillDown, type DrillState } from "@/components/DrillDown";

export const Route = createFileRoute("/_app/attendance/")({
  head: () => ({ meta: [{ title: "Attendance · Teacher Portal" }] }),
  component: AttendanceIndex,
});

function AttendanceIndex() {
  const [drill, setDrill] = useState<DrillState>({ dept: null, sem: null, section: null });
  const done = drill.dept && drill.sem !== null && drill.section;
  const assigned = done ? coursesFor(drill.dept!, drill.sem!, drill.section!) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Attendance Management</h1>
        <p className="text-sm text-muted-foreground">Select a department, semester and section to take attendance with AI face recognition.</p>
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
                <Card key={c.id} className="group rounded-2xl border-border/60 shadow-soft transition hover:-translate-y-1 hover:shadow-glass">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{c.code}</div>
                      <CardTitle className="mt-1 truncate text-base">{c.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="rounded-full">{c.enrolled}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-3 text-xs">
                      <div><div className="text-muted-foreground">Credits</div><div className="font-semibold">{c.credits}</div></div>
                      <div><div className="text-muted-foreground">Students</div><div className="font-semibold">{c.enrolled}</div></div>
                      <div><div className="text-muted-foreground">Att %</div><div className="font-semibold text-primary">{c.attendance}%</div></div>
                    </div>
                    <Link to="/attendance/$courseId" params={{ courseId: c.id }}>
                      <Button className="w-full rounded-xl">
                        <Camera className="mr-2 h-4 w-4" /> Take Attendance
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
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
