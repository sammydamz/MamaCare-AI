import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Pathway } from '@/lib/mamacare/types';
import { useMamaCare } from '@/providers/mamacare-provider';

export function RecordVitalsDialog({ patientId, pathway }: { patientId: string; pathway: Pathway }) {
  const [open, setOpen] = useState(false);
  const [bloodPressure, setBloodPressure] = useState('');
  const [kickCount, setKickCount] = useState('');
  const [copingIndex, setCopingIndex] = useState('');
  const { recordVitals } = useMamaCare();

  const handleSubmit = async () => {
    try {
      await recordVitals(patientId, {
        bloodPressure: bloodPressure || undefined,
        kickCount: kickCount ? parseInt(kickCount) : undefined,
        copingIndex: copingIndex ? parseInt(copingIndex) : undefined,
      });
      setOpen(false);
      setBloodPressure('');
      setKickCount('');
      setCopingIndex('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Record Vitals
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Vitals</DialogTitle>
          <DialogDescription>
            Record patient vital signs.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Blood Pressure</label>
            <Input
              placeholder="e.g. 120/80 mmHg"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
            />
          </div>
          {pathway === 'Pregnancy' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Kick Count</label>
              <Input
                type="number"
                placeholder="Enter kick count"
                value={kickCount}
                onChange={(e) => setKickCount(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Coping Index (1-10)</label>
              <Input
                type="number"
                min={1}
                max={10}
                placeholder="Enter coping index"
                value={copingIndex}
                onChange={(e) => setCopingIndex(e.target.value)}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
