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

export function CreateReferralDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const [facilityId, setFacilityId] = useState('');
  const [reason, setReason] = useState('');
  const { facilities, createReferral } = useMamaCare();

  const handleSubmit = async () => {
    if (!facilityId || !reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createReferral({ patientId, facilityId, reason });
      toast.success('Referral created successfully');
      setOpen(false);
      setFacilityId('');
      setReason('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create referral');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Create Referral
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Referral</DialogTitle>
          <DialogDescription>
            Refer patient to a healthcare facility.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Facility</label>
            <Select value={facilityId} onValueChange={setFacilityId}>
              <SelectTrigger>
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              placeholder="Enter referral reason..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!facilityId || !reason}
            >
              Submit Referral
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
