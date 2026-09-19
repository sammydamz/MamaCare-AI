import { useState } from 'react';
import { toast } from 'sonner';
import { useMamaCare } from '@/providers/mamacare-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function LogVisitDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const [visitType, setVisitType] = useState('');
  const [notes, setNotes] = useState('');
  const { logVisit } = useMamaCare();

  const handleSubmit = async () => {
    if (!visitType || !notes) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await logVisit(patientId, { visitType, notes });
      toast.success('Visit logged successfully');
      setOpen(false);
      setVisitType('');
      setNotes('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to log visit');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Log Visit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Visit</DialogTitle>
          <DialogDescription>
            Record details from a patient visit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Visit Type</label>
            <Select value={visitType} onValueChange={setVisitType}>
              <SelectTrigger>
                <SelectValue placeholder="Select visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine">Routine ANC</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Home">Home Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Visit Notes</label>
            <Textarea
              placeholder="Enter visit notes..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!visitType || !notes}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
