import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Users, Percent } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  coursesFor, studentsFor, attendanceTrend, performanceTrend, type Course,
} from "@/lib/mock-data";
import { DrillDown, BackToDrillDown, type DrillState } from "@/components/DrillDown";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/_app/performance")({
  head: () => ({ meta: [{ title: "Performance · Teacher Portal" }] }),
  component: PerformancePage,
});

function PerformancePage() {
  const [drill, setDrill] = useState<DrillState>({ dept: null, sem: null, section: null });
  const [course, setCourse] = useState<Course | null>(null);

  const done = drill.dept && drill.sem !== null && drill.section;
  const assigned = done ? coursesFor(drill.dept!, drill.sem!, drill.section!) : [];

  if (course) {
    return <PerformanceDashboard course={course} onBack={() => setCourse(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Student Performance</h1>
        <p className="text-sm text-muted-foreground">Select a department, semester and section, then choose a course.</p>
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
                  <div className="gradient-brand relative h-20 p-4 text-white">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{c.code}</div>
                    <div className="mt-1 font-display text-lg font-bold">{c.name}</div>
                  </div>
                  <CardContent className="p-5">
                    <Button className="w-full rounded-xl" onClick={() => setCourse(c)}>
                      <TrendingUp className="mr-1.5 h-4 w-4" /> View Performance
                    </Button>
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

function PerformanceDashboard({ course, onBack }: { course: Course; onBack: () => void }) {
  const roster = useMemo(() => studentsFor(course.id, 12), [course.id]);
  const avgMarks = (roster.reduce((s, x) => s + x.internal, 0) / roster.length).toFixed(1);
  const avgAttendance = (roster.reduce((s, x) => s + x.attendance, 0) / roster.length).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackToDrillDown label="Back" onClick={onBack} />
        <div>
          <h1 className="font-display text-2xl font-bold">{course.name} · Performance Dashboard</h1>
          <p className="text-sm text-muted-foreground">{course.code} · Semester {course.sem} · Section {course.section}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={course.enrolled} icon={Users} tone="primary" />
        <StatCard label="Average Attendance" value={`${avgAttendance}%`} icon={Percent} tone="success" />
        <StatCard label="Average Marks" value={`${avgMarks}/50`} icon={Award} tone="accent" />
        <StatCard label="Course Attendance" value={`${course.attendance}%`} icon={TrendingUp} tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base">Attendance Graph</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#293681" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#293681" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Area type="monotone" dataKey="value" stroke="#293681" fill="url(#pg1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base">Internal Marks Graph</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Line type="monotone" dataKey="marks" stroke="#4274D9" strokeWidth={3} dot={{ r: 4, fill: "#293681" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Course Statistics</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniStat label="Enrolled Students" value={course.enrolled} />
            <MiniStat label="Credit Hours" value={course.credits} />
            <MiniStat label="Avg Attendance" value={`${avgAttendance}%`} />
            <MiniStat label="Avg Internal Marks" value={`${avgMarks}/50`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  );
}
