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
import { Textarea } from '@/components/ui/textarea';

export function FacilityFormDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          + Add Facility
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Facility</DialogTitle>
          <DialogDescription>
            Add a new healthcare facility to the directory.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Facility name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Address</label>
            <Input placeholder="Street address" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Phone</label>
            <Input placeholder="+234-0-0000-000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Hours</label>
              <Input placeholder="e.g. 24/7 Emergency" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Distance</label>
              <Input placeholder="e.g. 5.2 km" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Services</label>
            <Textarea placeholder="Comma-separated, e.g. Obstetrics, Emergency, Laboratory" rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Add Facility
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
