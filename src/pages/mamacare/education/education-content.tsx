import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const selectCls = 'rounded-lg border border-input bg-white px-3 py-2 text-sm';

export type EduPiece = {
  id: string;
  title: string;
  track: string;
  trimester: string | null;
  month: number | null;
  status: 'draft' | 'in-review' | 'approved';
  sourceRef: string | null;
  audioUrl: string | null;
  audioMode: string;
  currentVersion: number;
  reviewer: string | null;
  approvedAt: string | null;
  reviewNote: string | null;
  languages: string[];
};

function headers(): Record<string, string> {
  try {
    const raw = localStorage.getItem('mamacare-current-user');
    if (!raw) return {};
    return { 'X-User-Email': JSON.parse(raw).email || '' };
  } catch {
    return {};
  }
}

async function api(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers(), ...((options.headers as Record<string, string>) || {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

const TRACKS = ['prenatal', 'postnatal', 'bereavement'];
const LANGS = ['en', 'tw', 'dag', 'ewe', 'ga'];

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  'in-review': 'outline',
  approved: 'default',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  'in-review': 'In Review',
  approved: 'Approved',
};

function targetLabel(p: EduPiece) {
  if (p.track === 'prenatal') return p.month ? `Month ${p.month}` : p.trimester ? `${p.trimester} trimester` : 'All prenatal';
  if (p.track === 'postnatal') return p.month ? `Post month ${p.month}` : 'Early (0–6 wks)';
  return 'All bereaved mothers';
}

const emptyForm = { title: '', track: 'prenatal', trimester: '', month: '', sourceRef: '', script: '', language: 'en', audioMode: 'generated' };

export function EducationContent() {
  const [tab, setTab] = useState('library');
  const [pieces, setPieces] = useState<EduPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<EduPiece | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewer, setReviewer] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    try {
      setPieces(await api('/api/education'));
    } catch {
      toast.error('Could not load education library');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  }

  function openEdit(p: EduPiece) {
    setEditing(p);
    setForm({ ...emptyForm, title: p.title, track: p.track, trimester: p.trimester || '', month: p.month?.toString() || '', sourceRef: p.sourceRef || '', language: 'en', audioMode: p.audioMode });
    setDrawerOpen(true);
  }

  async function save() {
    try {
      if (editing) {
        await api(`/api/education/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ action: 'edit', ...form, month: form.month ? parseInt(form.month) : null, trimester: form.trimester || null }),
        });
        toast.success('Draft updated');
      } else {
        await api('/api/education', {
          method: 'POST',
          body: JSON.stringify({ ...form, month: form.month ? parseInt(form.month) : null, trimester: form.trimester || null }),
        });
        toast.success('Draft created');
      }
      setDrawerOpen(false);
      load();
    } catch {
      toast.error('Save failed');
    }
  }

  async function act(id: string, action: string, extra: Record<string, unknown> = {}) {
    try {
      await api(`/api/education/${id}`, { method: 'PATCH', body: JSON.stringify({ action, ...extra }) });
      toast.success(action === 'approve' ? 'Approved and frozen' : 'Done');
      setExpanded(null);
      setReviewer('');
      setNote('');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Action failed');
    }
  }

  const filtered = pieces.filter((p) => {
    if (trackFilter !== 'all' && p.track !== trackFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const inReview = pieces.filter((p) => p.status === 'in-review');
  const gaps = pieces.filter((p) => p.status !== 'approved' || !p.languages.some((l) => l.startsWith('tw')));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Clinician-approved lessons only. Approved pieces freeze — edits create a new version.
        </p>
        <Button onClick={openNew}>+ New piece</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="library">Library ({pieces.length})</TabsTrigger>
          <TabsTrigger value="review">Review queue ({inReview.length})</TabsTrigger>
          <TabsTrigger value="gaps">Gap report ({gaps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <div className="flex flex-wrap items-center gap-3 py-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pieces…"
                className="pl-8"
              />
            </div>
            <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} aria-label="Track filter" className={selectCls}>
              <option value="all">All tracks</option>
              {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status filter" className={selectCls}>
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="in-review">In review</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">{p.sourceRef || 'No source ref'}</div>
                      </TableCell>
                      <TableCell>{targetLabel(p)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(p.languages.length ? p.languages : ['—']).map((l) => <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={STATUS_VARIANT[p.status]}>{STATUS_LABEL[p.status]}</Badge></TableCell>
                      <TableCell>v{p.currentVersion}{p.reviewer ? ` · ${p.reviewer}` : ''}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {p.status !== 'approved' && <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>}
                          {p.status === 'draft' && <Button size="sm" variant="outline" onClick={() => act(p.id, 'review')}>Send for review</Button>}
                          {p.status === 'approved' && <Button size="sm" variant="outline" onClick={() => act(p.id, 'new-version', { script: '', language: 'en' })}>New version</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="review">
          <div className="flex flex-col gap-3 py-4">
            {!inReview.length && <Card><CardContent className="p-6 text-sm text-muted-foreground">Nothing waiting for review.</CardContent></Card>}
            {inReview.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.title} <span className="text-xs text-muted-foreground">v{p.currentVersion} · {targetLabel(p)}</span></div>
                      {p.reviewNote && <div className="text-xs text-red-600">Sent back: {p.reviewNote}</div>}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                      {expanded === p.id ? 'Close' : 'Review'}
                    </Button>
                  </div>
                  {expanded === p.id && (
                    <div className="mt-3 flex flex-col gap-2 border-t pt-3">
                      <div className="flex flex-col gap-1.5">
                        <Label>Reviewer name</Label>
                        <Input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Reviewer name" className="max-w-xs" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => act(p.id, 'approve', { reviewer: reviewer || 'Reviewer', language: 'en' })}>Approve & freeze</Button>
                        <Button size="sm" variant="destructive" onClick={() => act(p.id, 'sendback', { note: note || 'Needs changes' })}>Send back</Button>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Review note</Label>
                        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note for the author (for send-back)" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps">
          <div className="flex flex-col gap-3 py-4">
            <Card className="border-amber-300">
              <CardContent className="p-4 text-sm">
                Pieces below block a pilot launch: not yet approved, or approved without a Twi version.
                (4-week-need scheduling lands once due-date data exists.)
              </CardContent>
            </Card>
            {gaps.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{targetLabel(p)} · {p.status} · {p.languages.join(', ') || 'no versions yet'}</div>
                  </div>
                  <Badge variant={p.status === 'approved' ? 'outline' : 'destructive'}>
                    {p.status === 'approved' ? 'Missing Twi' : 'Not approved'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit draft' : 'New education piece'}</DialogTitle>
            <DialogDescription>Create clinician-approved education content.</DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={set('title')} placeholder="e.g. Iron-rich foods in pregnancy" />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <Label>Track</Label>
                <select value={form.track} onChange={(e) => set('track')(e)} className={selectCls}>
                  {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-32">
                <Label>Language</Label>
                <select value={form.language} onChange={(e) => set('language')(e)} className={selectCls}>
                  {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <Label>Trimester</Label>
                <Input value={form.trimester} onChange={set('trimester')} placeholder="1st / 2nd / 3rd (optional)" />
              </div>
              <div className="flex flex-col gap-1.5 w-44">
                <Label>Month</Label>
                <Input value={form.month} onChange={set('month')} placeholder="Month 1–9 (optional)" inputMode="numeric" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Source reference</Label>
              <Input value={form.sourceRef} onChange={set('sourceRef')} placeholder="e.g. WHO ANC 2016 §A.2.1" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Script</Label>
              <Textarea value={form.script} onChange={set('script')} placeholder="Approved script text (45–90 seconds spoken)" rows={8} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save draft' : 'Create draft'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
