import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PenSquare, Save, Send, CheckCircle2 } from "lucide-react";
import {
  coursesFor, studentsFor, practicalComponents, theoryComponents,
  PRACTICAL_MAX, THEORY_MAX, TOTAL_INTERNAL_MAX,
  defaultMarksEntry, practicalTotal, theoryTotal, internalTotal,
  type MarksEntry, type Course,
} from "@/lib/mock-data";
import { DrillDown, BackToDrillDown, type DrillState } from "@/components/DrillDown";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/marks")({
  head: () => ({ meta: [{ title: "Internal Marks · Teacher Portal" }] }),
  component: MarksPage,
});

type Roster = Record<string, MarksEntry>;
type PublishState = "draft" | "published";

function MarksPage() {
  const [drill, setDrill] = useState<DrillState>({ dept: null, sem: null, section: null });
  const [course, setCourse] = useState<Course | null>(null);

  const done = drill.dept && drill.sem !== null && drill.section;
  const assigned = done ? coursesFor(drill.dept!, drill.sem!, drill.section!) : [];

  if (course) {
    return <MarksEntryScreen course={course} onBack={() => setCourse(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Internal Marks</h1>
        <p className="text-sm text-muted-foreground">Select a department, semester and section, then choose a course to enter marks.</p>
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
                      <PenSquare className="mr-1.5 h-4 w-4" /> Enter Marks
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

function MarksEntryScreen({ course, onBack }: { course: Course; onBack: () => void }) {
  const roster = useMemo(() => studentsFor(course.id, 12), [course.id]);
  const [entries, setEntries] = useState<Roster>(() =>
    Object.fromEntries(roster.map((s) => [s.id, defaultMarksEntry()])),
  );
  const [status, setStatus] = useState<PublishState>("draft");
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [draftSavedSuccess, setDraftSavedSuccess] = useState(false);

  function updateEntry(studentId: string, next: MarksEntry) {
    setEntries((e) => ({ ...e, [studentId]: next }));
  }

  function saveDraft() {
    setStatus("draft");
    setDraftSavedSuccess(true);
  }

  function publish() {
    setStatus("published");
    setPublishConfirmOpen(false);
    setPublishedSuccess(true);
  }

  const student = editingStudent ? roster.find((s) => s.id === editingStudent) ?? null : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <BackToDrillDown label="Back" onClick={onBack} />
          <div>
            <h1 className="font-display text-2xl font-bold">{course.name} · Internal Marks</h1>
            <p className="text-sm text-muted-foreground">
              {course.code} · Practical ({PRACTICAL_MAX}) + Theory ({THEORY_MAX}) = {TOTAL_INTERNAL_MAX} marks total.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("rounded-full", status === "published" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-secondary text-foreground")}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
          <Button variant="outline" className="rounded-xl" onClick={saveDraft}>
            <Save className="mr-1.5 h-4 w-4" />Save Draft
          </Button>
          <Button className="rounded-xl" onClick={() => setPublishConfirmOpen(true)}>
            <Send className="mr-1.5 h-4 w-4" />Publish
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Practical {PRACTICAL_MAX} marks · Theory {THEORY_MAX} marks · Total {TOTAL_INTERNAL_MAX} marks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
                  <th>Student</th>
                  <th>Practical /{PRACTICAL_MAX}</th>
                  <th>Theory /{THEORY_MAX}</th>
                  <th>Total /{TOTAL_INTERNAL_MAX}</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roster.map((s) => {
                  const entry = entries[s.id];
                  const p = practicalTotal(entry);
                  const t = theoryTotal(entry);
                  const total = internalTotal(entry);
                  return (
                    <tr key={s.id} className="[&>td]:px-4 [&>td]:py-2.5">
                      <td>
                        <div className="text-sm font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.enrollment}</div>
                      </td>
                      <td><span className="font-mono text-sm">{p.toFixed(1)}</span></td>
                      <td><span className="font-mono text-sm">{t.toFixed(1)}</span></td>
                      <td>
                        <span className="rounded-lg bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                          {total.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-right">
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setEditingStudent(s.id)}>
                          <PenSquare className="mr-1.5 h-3.5 w-3.5" />Enter Marks
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {student && (
        <MarksEntryDialog
          open={!!student}
          onOpenChange={(v) => !v && setEditingStudent(null)}
          student={student}
          entry={entries[student.id]}
          onSave={(next) => { updateEntry(student.id, next); setEditingStudent(null); }}
        />
      )}

      {/* Publish confirmation */}
      <AlertDialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Internal Marks?</AlertDialogTitle>
            <AlertDialogDescription>
              Once published, marks for {course.name} become visible to all {roster.length} students. You can still make edits afterwards, but students will see the update.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl" onClick={publish}>Yes, Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Draft saved success */}
      <Dialog open={draftSavedSuccess} onOpenChange={setDraftSavedSuccess}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <DialogHeader className="items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle>Draft Saved Successfully</DialogTitle>
            <DialogDescription>Your changes for {course.name} have been stored as a draft.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button className="rounded-xl" onClick={() => setDraftSavedSuccess(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Published success */}
      <Dialog open={publishedSuccess} onOpenChange={setPublishedSuccess}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <DialogHeader className="items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle>Marks Published Successfully</DialogTitle>
            <DialogDescription>Internal marks for {course.name} are now visible to students.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button className="rounded-xl" onClick={() => setPublishedSuccess(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MarksEntryDialog({
  open, onOpenChange, student, entry, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  student: { id: string; name: string; enrollment: string };
  entry: MarksEntry;
  onSave: (entry: MarksEntry) => void;
}) {
  const [form, setForm] = useState<MarksEntry>(entry);

  function update(key: string, max: number, raw: string) {
    const val = Math.max(0, Math.min(max, Number(raw) || 0));
    setForm((f) => ({ ...f, [key]: val }));
  }

  const p = practicalTotal(form);
  const t = theoryTotal(form);
  const total = p + t;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{student.name}</DialogTitle>
          <DialogDescription>{student.enrollment} · Enter component-wise internal marks.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <ComponentGroup title={`Practical (${PRACTICAL_MAX})`} components={practicalComponents} form={form} onChange={update} />
          <ComponentGroup title={`Theory (${THEORY_MAX})`} components={theoryComponents} form={form} onChange={update} />

          <div className="grid grid-cols-3 gap-3 rounded-xl bg-secondary/60 p-3 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Practical</div>
              <div className="font-display text-lg font-bold">{p.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Theory</div>
              <div className="font-display text-lg font-bold">{t.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total /{TOTAL_INTERNAL_MAX}</div>
              <div className="font-display text-lg font-bold text-primary">{total.toFixed(1)}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="rounded-xl" onClick={() => onSave(form)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ComponentGroup({
  title, components, form, onChange,
}: {
  title: string;
  components: readonly { key: string; label: string; weightPct: number; max: number }[];
  form: MarksEntry;
  onChange: (key: string, max: number, raw: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="space-y-2.5">
        {components.map((c) => (
          <div key={c.key} className="flex items-center gap-3">
            <Label htmlFor={c.key} className="flex-1 text-sm font-normal">
              {c.label} <span className="text-xs text-muted-foreground">({c.weightPct}% · max {c.max})</span>
            </Label>
            <Input
              id={c.key}
              type="number"
              min={0}
              max={c.max}
              step={0.5}
              value={form[c.key] ?? 0}
              onChange={(e) => onChange(c.key, c.max, e.target.value)}
              className="h-9 w-20 rounded-lg text-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
