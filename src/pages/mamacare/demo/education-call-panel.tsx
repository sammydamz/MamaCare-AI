import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useMamaCare } from '@/providers/mamacare-provider';

type NextPiece = {
  pieceId: string | null;
  title?: string;
  version?: number;
  language?: string;
  fallback?: boolean;
  script?: string;
  audioUrl?: string;
};

function trackFor(pathway: string) {
  if (pathway === 'prenatal') return 'prenatal';
  if (pathway === 'postnatal') return 'postnatal';
  return 'bereavement';
}

export function EducationCallPanel() {
  const { patients } = useMamaCare();
  const [patientId, setPatientId] = useState('');
  const [month, setMonth] = useState('');
  const [piece, setPiece] = useState<NextPiece | null>(null);
  const [loading, setLoading] = useState(false);
  const [replays, setReplays] = useState(0);

  const patient = patients.find((p) => p.id === patientId);

  async function fetchNext() {
    if (!patient) return;
    setLoading(true);
    try {
      const q = new URLSearchParams({
        track: trackFor(patient.pathway),
        language: patient.language || 'en',
        patientId: patient.id,
        ...(month ? { month } : {}),
      });
      const res = await fetch(`/api/education/next?${q}`);
      const data = await res.json();
      setPiece(data);
      setReplays(0);
      if (!data.pieceId) toast.info('No undelivered approved content for this mother');
    } catch {
      toast.error('Could not fetch education segment');
    } finally {
      setLoading(false);
    }
  }

  async function record(extra: Record<string, unknown>) {
    if (!patient || !piece?.pieceId) return;
    try {
      await fetch('/api/education/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pieceId: piece.pieceId, version: piece.version, patientId: patient.id,
          language: piece.language, replayed: replays, ...extra,
        }),
      });
      toast.success('Recorded');
      fetchNext();
    } catch {
      toast.error('Recording failed');
    }
  }

  return (
    <Card className="mt-4 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Education segment</CardTitle>
        <CardDescription>Approved lesson for this call: screening first, lesson after.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Select value={patientId} onValueChange={(v) => { setPatientId(v); setPiece(null); }}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Select mother" /></SelectTrigger>
            <SelectContent>
              {patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Mo." inputMode="numeric" className="w-20" />
          <Button variant="outline" onClick={fetchNext} disabled={!patient || loading}>
            {loading ? '…' : 'Load'}
          </Button>
        </div>

        {piece?.pieceId && (
          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{piece.title}</span>
              <Badge variant="secondary">v{piece.version} · {piece.language}</Badge>
              {piece.fallback && <Badge variant="warning">English fallback, logged</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">{piece.script}</p>
            {piece.audioUrl && <audio controls src={piece.audioUrl} className="w-full" />}
            <div className="flex gap-2">
              <Button size="sm" onClick={() => record({ stayedPct: 100 })}>Mark delivered</Button>
              <Button size="sm" variant="outline" onClick={() => { setReplays((r) => r + 1); record({ stayedPct: 100, replayed: replays + 1 }); }}>
                Replay ({replays})
              </Button>
              <Button size="sm" variant="destructive" onClick={() => record({ skipped: true, skipReason: 'danger flag' })}>
                Skip: danger
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
