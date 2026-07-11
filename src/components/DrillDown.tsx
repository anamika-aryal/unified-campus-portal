import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Building2, Layers, Users2 } from "lucide-react";
import { departments, semesterList, sectionList, coursesFor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type DrillState = {
  dept: string | null;
  sem: number | null;
  section: string | null;
};

/**
 * Shared Department → Semester → Section drilldown.
 * Renders breadcrumbs + the current step's cards. When all three are chosen,
 * calls back so the parent page can render the assigned-courses list itself
 * (each page needs different course-card actions).
 */
export function DrillDown({
  value,
  onChange,
}: {
  value: DrillState;
  onChange: (next: DrillState) => void;
}) {
  const { dept, sem, section } = value;
  const step = !dept ? "dept" : sem === null ? "sem" : !section ? "section" : "done";

  const deptObj = departments.find((d) => d.id === dept);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {step !== "dept" && (
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <Crumb label="Departments" onClick={() => onChange({ dept: null, sem: null, section: null })} />
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <Crumb
            label={deptObj?.name ?? ""}
            onClick={() => onChange({ dept, sem: null, section: null })}
            active={step === "sem"}
          />
          {sem !== null && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Crumb label={`Semester ${sem}`} onClick={() => onChange({ dept, sem, section: null })} active={step === "section"} />
            </>
          )}
          {section && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Crumb label={`Section ${section}`} active={step === "done"} />
            </>
          )}
        </div>
      )}

      {step === "dept" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => onChange({ dept: d.id, sem: null, section: null })}
              className="text-left"
            >
              <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-soft transition hover:-translate-y-1 hover:shadow-glass">
                <div className="gradient-brand relative flex h-28 items-center gap-3 p-5 text-white">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{d.code}</div>
                    <div className="truncate font-display text-lg font-bold">{d.name}</div>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 shrink-0 opacity-70 transition group-hover:translate-x-1" />
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {step === "sem" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {semesterList.map((s) => (
            <button key={s} onClick={() => onChange({ dept, sem: s, section: null })}>
              <Card className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-border/60 py-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glass">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-white shadow-soft">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="font-display text-sm font-bold">Semester {s}</div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {step === "section" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sectionList.map((sec) => {
            const count = dept && sem !== null ? coursesFor(dept, sem, sec.id).length : 0;
            return (
              <button key={sec.id} onClick={() => onChange({ dept, sem, section: sec.id })} disabled={count === 0}>
                <Card
                  className={cn(
                    "group flex items-center gap-4 rounded-2xl border-border/60 p-5 shadow-soft transition",
                    count > 0 ? "hover:-translate-y-1 hover:border-primary/40 hover:shadow-glass" : "opacity-50",
                  )}
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white shadow-soft">
                    <Users2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="font-display text-base font-bold">{sec.label}</div>
                    <div className="text-xs text-muted-foreground">{count} assigned course{count === 1 ? "" : "s"}</div>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1" />
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Crumb({ label, onClick, active }: { label: string; onClick?: () => void; active?: boolean }) {
  if (!onClick) {
    return <span className={cn("font-semibold", active && "text-primary")}>{label}</span>;
  }
  return (
    <button onClick={onClick} className="font-medium text-muted-foreground hover:text-primary hover:underline">
      {label}
    </button>
  );
}

export function BackToDrillDown({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <Button variant="ghost" size="sm" className="rounded-xl" onClick={onClick}>
      <ArrowLeft className="mr-1.5 h-4 w-4" /> {label}
    </Button>
  );
}
