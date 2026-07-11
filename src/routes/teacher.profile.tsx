import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Clock, Briefcase, GraduationCap, Pencil, Key, Camera, Eye, EyeOff, Check, X } from "lucide-react";
import { teacher, courses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "My Profile · Teacher Portal" }] }),
  component: Profile,
});

function Profile() {
  const [profile, setProfile] = useState({ ...teacher });
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-glass">
        <div className="h-32 gradient-brand" />
        <div className="relative px-6 pb-6">
          <div className="-mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-28 w-28 border-4 border-background shadow-glass">
                <AvatarImage src={profile.photo} />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h1 className="font-display text-2xl font-bold">{profile.title} {profile.name}</h1>
                <p className="text-sm text-muted-foreground">{profile.specialization}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">{profile.department}</Badge>
                  <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">{profile.experience} experience</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setPwdOpen(true)}>
                <Key className="mr-1.5 h-4 w-4" />Change Password
              </Button>
              <Button className="rounded-xl" onClick={() => setEditOpen(true)}>
                <Pencil className="mr-1.5 h-4 w-4" />Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-soft md:col-span-2">
          <CardHeader><CardTitle className="text-base">Contact & Office</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info icon={Mail} label="Email" value={profile.email} />
            <Info icon={Phone} label="Phone" value={profile.phone} />
            <Info icon={MapPin} label="Office" value={profile.office} />
            <Info icon={Clock} label="Office Hours" value={profile.officeHours} />
            <Info icon={Briefcase} label="Qualification" value={profile.qualification} />
            <Info icon={GraduationCap} label="Specialization" value={profile.specialization} />
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft">
          <CardHeader><CardTitle className="text-base">Assigned Courses</CardTitle></CardHeader>
          <CardContent className="space-y-2.5">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary font-mono text-xs font-bold">
                  {c.code.split("-")[1]}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.code} · Sem {c.sem}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} profile={profile} onSave={setProfile} />
      <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Profile modal
// ---------------------------------------------------------------------------

function EditProfileDialog({
  open, onOpenChange, profile, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile: typeof teacher;
  onSave: (p: typeof teacher) => void;
}) {
  const [form, setForm] = useState(profile);

  function handleOpenChange(v: boolean) {
    if (v) setForm(profile);
    onOpenChange(v);
  }

  function update(field: keyof typeof teacher, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function save() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Enter a valid email address");
      return;
    }
    onSave(form);
    toast.success("Profile updated successfully");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal and professional details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={form.photo} />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="photo">Profile Photo URL</Label>
              <div className="flex gap-2">
                <Input id="photo" value={form.photo} onChange={(e) => update("photo", e.target.value)} className="rounded-xl" />
                <Button type="button" variant="outline" size="icon" className="shrink-0 rounded-xl">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" id="name" value={form.name} onChange={(v) => update("name", v)} />
            <Field label="Email" id="email" type="email" value={form.email} onChange={(v) => update("email", v)} />
            <Field label="Phone" id="phone" value={form.phone} onChange={(v) => update("phone", v)} />
            <Field label="Office" id="office" value={form.office} onChange={(v) => update("office", v)} />
            <Field label="Qualification" id="qualification" value={form.qualification} onChange={(v) => update("qualification", v)} />
            <Field label="Specialization" id="specialization" value={form.specialization} onChange={(v) => update("specialization", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="rounded-xl" onClick={save}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label, id, value, onChange, type = "text",
}: {
  label: string; id: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Change Password modal
// ---------------------------------------------------------------------------

function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(next);

  function reset() {
    setCurrent(""); setNext(""); setConfirm(""); setError(null);
  }

  function handleOpenChange(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function submit() {
    if (!current) return setError("Please enter your current password");
    // mock validation against a known "current" password
    if (current !== "password123") return setError("Current password is incorrect");
    if (strength.score < 2) return setError("Choose a stronger new password");
    if (next !== confirm) return setError("New password and confirmation do not match");
    if (next === current) return setError("New password must be different from current password");

    toast.success("Password updated successfully");
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Choose a strong password you don't use elsewhere.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="current-pwd">Current Password</Label>
            <div className="relative">
              <Input
                id="current-pwd"
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => { setCurrent(e.target.value); setError(null); }}
                className="rounded-xl pr-10"
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-pwd">New Password</Label>
            <div className="relative">
              <Input
                id="new-pwd"
                type={showNext ? "text" : "password"}
                value={next}
                onChange={(e) => { setNext(e.target.value); setError(null); }}
                className="rounded-xl pr-10"
                placeholder="Enter new password"
              />
              <button type="button" onClick={() => setShowNext((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {next && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < strength.score ? strength.color : "bg-muted")} />
                  ))}
                </div>
                <div className="text-[11px] text-muted-foreground">{strength.label}</div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-pwd">Confirm New Password</Label>
            <Input
              id="confirm-pwd"
              type={showNext ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(null); }}
              className="rounded-xl"
              placeholder="Re-enter new password"
            />
            {confirm && (
              <div className={cn("flex items-center gap-1 text-[11px]", next === confirm ? "text-emerald-600" : "text-destructive")}>
                {next === confirm ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {next === confirm ? "Passwords match" : "Passwords do not match"}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button className="rounded-xl" onClick={submit}>Update Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "bg-muted" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-amber-500", "bg-emerald-500"];
  return { score, label: labels[score], color: colors[score] };
}
