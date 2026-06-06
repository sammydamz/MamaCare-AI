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
import { useMamaCare } from '@/providers/mamacare-provider';

export function FacilityFormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [distance, setDistance] = useState('');
  const [services, setServices] = useState('');
  const { addFacility } = useMamaCare();

  const handleSubmit = async () => {
    if (!name || !address || !phone || !hours || !distance || !services) return;
    try {
      const servicesArray = services.split(',').map((s) => s.trim()).filter(Boolean);
      await addFacility({
        name,
        address,
        phone,
        hours,
        distance,
        services: servicesArray,
      });
      setOpen(false);
      setName('');
      setAddress('');
      setPhone('');
      setHours('');
      setDistance('');
      setServices('');
    } catch (err) {
      console.error(err);
    }
  };

  const isFormValid = name && address && phone && hours && distance && services;

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
            <Input
              placeholder="Facility name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Address</label>
            <Input
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Phone</label>
            <Input
              placeholder="+234-0-0000-000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Hours</label>
              <Input
                placeholder="e.g. 24/7 Emergency"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Distance</label>
              <Input
                placeholder="e.g. 5.2 km"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Services</label>
            <Textarea
              placeholder="Comma-separated, e.g. Obstetrics, Emergency, Laboratory"
              rows={3}
              value={services}
              onChange={(e) => setServices(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid}>
              Add Facility
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
