import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@heroui/react/button';
import { Card } from '@heroui/react/card';
import { Chip } from '@heroui/react/chip';
import { Drawer } from '@heroui/react/drawer';
import { Input } from '@heroui/react/input';
import { ListBox } from '@heroui/react/list-box';
import { ListBoxItem } from '@heroui/react/list-box-item';
import { SearchField } from '@heroui/react/search-field';
import { Select } from '@heroui/react/select';
import { Table } from '@heroui/react/table';
import { Tabs } from '@heroui/react/tabs';
import { TextArea } from '@heroui/react/textarea';

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

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'success'> = {
  draft: 'default',
  'in-review': 'warning',
  approved: 'success',
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

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

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
        <Button color="primary" onClick={openNew}>+ New piece</Button>
      </div>

      <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(k as string)}>
        <Tabs.List>
          <Tabs.Tab id="library">Library ({pieces.length})</Tabs.Tab>
          <Tabs.Tab id="review">Review queue ({inReview.length})</Tabs.Tab>
          <Tabs.Tab id="gaps">Gap report ({gaps.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="library">
          <div className="flex flex-wrap gap-3 py-4">
            <SearchField value={search} onChange={setSearch} aria-label="Search pieces" className="w-64" />
            <Select selectedKey={trackFilter} onSelectionChange={(k) => setTrackFilter(k as string)} aria-label="Track filter" className="w-44">
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBoxItem id="all">All tracks</ListBoxItem>
                  {TRACKS.map((t) => <ListBoxItem key={t} id={t}>{t}</ListBoxItem>)}
                </ListBox>
              </Select.Popover>
            </Select>
            <Select selectedKey={statusFilter} onSelectionChange={(k) => setStatusFilter(k as string)} aria-label="Status filter" className="w-44">
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBoxItem id="all">All statuses</ListBoxItem>
                  <ListBoxItem id="draft">Draft</ListBoxItem>
                  <ListBoxItem id="in-review">In review</ListBoxItem>
                  <ListBoxItem id="approved">Approved</ListBoxItem>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <Table aria-label="Education library">
              <Table.Header>
                <Table.Column>Title</Table.Column>
                <Table.Column>Target</Table.Column>
                <Table.Column>Languages</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Version</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {filtered.map((p) => (
                  <Table.Row key={p.id} id={p.id}>
                    <Table.Cell>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.sourceRef || 'No source ref'}</div>
                    </Table.Cell>
                    <Table.Cell>{targetLabel(p)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-1">
                        {(p.languages.length ? p.languages : ['—']).map((l) => <Chip key={l} size="sm">{l}</Chip>)}
                      </div>
                    </Table.Cell>
                    <Table.Cell><Chip size="sm" color={STATUS_COLOR[p.status]}>{p.status}</Chip></Table.Cell>
                    <Table.Cell>v{p.currentVersion}{p.reviewer ? ` · ${p.reviewer}` : ''}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-1">
                        {p.status !== 'approved' && <Button size="sm" variant="flat" onClick={() => openEdit(p)}>Edit</Button>}
                        {p.status === 'draft' && <Button size="sm" variant="flat" color="warning" onClick={() => act(p.id, 'review')}>Send for review</Button>}
                        {p.status === 'approved' && <Button size="sm" variant="flat" onClick={() => act(p.id, 'new-version', { script: '', language: 'en' })}>New version</Button>}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Tabs.Panel>

        <Tabs.Panel id="review">
          <div className="flex flex-col gap-3 py-4">
            {!inReview.length && <Card className="p-6 text-sm text-muted-foreground">Nothing waiting for review.</Card>}
            {inReview.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.title} <span className="text-xs text-muted-foreground">v{p.currentVersion} · {targetLabel(p)}</span></div>
                    {p.reviewNote && <div className="text-xs text-red-600">Sent back: {p.reviewNote}</div>}
                  </div>
                  <Button size="sm" variant="flat" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                    {expanded === p.id ? 'Close' : 'Review'}
                  </Button>
                </div>
                {expanded === p.id && (
                  <div className="mt-3 flex flex-col gap-2 border-t pt-3">
                    <Input value={reviewer} onChange={setReviewer} aria-label="Reviewer name" placeholder="Reviewer name" className="max-w-xs" />
                    <div className="flex gap-2">
                      <Button size="sm" color="success" onClick={() => act(p.id, 'approve', { reviewer: reviewer || 'Reviewer', language: 'en' })}>Approve & freeze</Button>
                      <Button size="sm" color="danger" variant="flat" onClick={() => act(p.id, 'sendback', { note: note || 'Needs changes' })}>Send back</Button>
                    </div>
                    <TextArea value={note} onChange={setNote} aria-label="Review note" placeholder="Note for the author (for send-back)" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="gaps">
          <div className="flex flex-col gap-3 py-4">
            <Card className="border-amber-300 p-4 text-sm">
              Pieces below block a pilot launch: not yet approved, or approved without a Twi version.
              (4-week-need scheduling lands once due-date data exists.)
            </Card>
            {gaps.map((p) => (
              <Card key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{targetLabel(p)} · {p.status} · {p.languages.join(', ') || 'no versions yet'}</div>
                </div>
                <Chip size="sm" color={p.status === 'approved' ? 'warning' : 'danger'}>
                  {p.status === 'approved' ? 'Missing Twi' : 'Not approved'}
                </Chip>
              </Card>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs>

      <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Header><Drawer.Heading>{editing ? 'Edit draft' : 'New education piece'}</Drawer.Heading></Drawer.Header>
          <Drawer.Body>
            <div className="flex flex-col gap-3">
              <Input value={form.title} onChange={set('title')} aria-label="Title" placeholder="Title, e.g. Iron-rich foods in pregnancy" />
              <div className="flex gap-3">
                <Select selectedKey={form.track} onSelectionChange={(k) => set('track')(k as string)} aria-label="Track" className="flex-1">
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>{TRACKS.map((t) => <ListBoxItem key={t} id={t}>{t}</ListBoxItem>)}</ListBox>
                  </Select.Popover>
                </Select>
                <Select selectedKey={form.language} onSelectionChange={(k) => set('language')(k as string)} aria-label="Language" className="w-32">
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>{LANGS.map((l) => <ListBoxItem key={l} id={l}>{l}</ListBoxItem>)}</ListBox>
                  </Select.Popover>
                </Select>
              </div>
              <div className="flex gap-3">
                <Input value={form.trimester} onChange={set('trimester')} aria-label="Trimester group" placeholder="Trimester: 1st / 2nd / 3rd (optional)" className="flex-1" />
                <Input value={form.month} onChange={set('month')} aria-label="Month" placeholder="Month 1–9 (optional)" className="w-44" inputMode="numeric" />
              </div>
              <Input value={form.sourceRef} onChange={set('sourceRef')} aria-label="Source reference" placeholder="Source, e.g. WHO ANC 2016 §A.2.1" />
              <TextArea value={form.script} onChange={set('script')} aria-label="Script" placeholder="Approved script text (45–90 seconds spoken)" rows={8} />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="flat" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button color="primary" onClick={save}>{editing ? 'Save draft' : 'Create draft'}</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}
