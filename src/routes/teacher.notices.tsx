import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Bell, Search, Paperclip, CalendarDays, Eye } from "lucide-react";
import { notices } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/notices")({
  head: () => ({ meta: [{ title: "Notices · Teacher Portal" }] }),
  component: NoticesPage,
});

function NoticesPage() {
  const [query, setQuery] = useState("");
  const [openNoticeId, setOpenNoticeId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notices;
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.audience.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q),
    );
  }, [query]);

  const openNotice = openNoticeId ? notices.find((n) => n.id === openNoticeId) ?? null : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Notices</h1>
        <p className="text-sm text-muted-foreground">View notices published by the department and college.</p>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Notice Board</CardTitle>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notices…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-56 rounded-lg pl-8 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No notices match "{query}".
            </div>
          ) : (
            filtered.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-semibold">{n.title}</div>
                    <Badge variant="secondary" className="rounded-full text-[10px]">{n.type}</Badge>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{n.audience}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(n.publishedDate).toLocaleDateString()}</span>
                    {n.attachment && <span className="inline-flex items-center gap-1"><Paperclip className="h-3 w-3" />{n.attachment}</span>}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 rounded-lg" onClick={() => setOpenNoticeId(n.id)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />View
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={!!openNotice} onOpenChange={(v) => !v && setOpenNoticeId(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          {openNotice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{openNotice.title}</DialogTitle>
                  <Badge variant="secondary" className="rounded-full text-[10px]">{openNotice.type}</Badge>
                </div>
                <DialogDescription>
                  {openNotice.audience} · Published {new Date(openNotice.publishedDate).toLocaleDateString(undefined, { dateStyle: "long" })}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-foreground">{openNotice.description}</p>
              {openNotice.attachment && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 p-3 text-sm">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{openNotice.attachment}</span>
                  <Button size="sm" variant="outline" className="ml-auto rounded-lg">Download</Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
