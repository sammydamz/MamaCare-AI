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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PATHWAY_LABELS, LANGUAGE_LABELS } from '@/lib/mamacare/constants';

export function RegisterPatientDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          + Register
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Add a new patient to the MamaCare programme.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="Enter patient name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Age</label>
            <Input type="number" placeholder="Enter age" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Language</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Pathway</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select pathway" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PATHWAY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Register Patient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
