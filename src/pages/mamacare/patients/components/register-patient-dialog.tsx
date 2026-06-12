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
import { useMamaCare } from '@/providers/mamacare-provider';
import type { Pathway } from '@/lib/mamacare/types';

export function RegisterPatientDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('');
  const [pathway, setPathway] = useState<Pathway | ''>('');
  const { registerPatient } = useMamaCare();

  const handleSubmit = async () => {
    if (!name || !age || !phone || !language || !pathway) return;
    try {
      const defaultStage = pathway === 'Pregnancy' ? '12 weeks' : 'Post-loss: 1 month';
      await registerPatient({
        name,
        age: parseInt(age),
        pathway,
        language,
        stage: defaultStage,
        phone,
      });
      setOpen(false);
      setName('');
      setAge('');
      setPhone('');
      setLanguage('');
      setPathway('');
    } catch (err) {
      console.error(err);
    }
  };

  const isFormValid = name && age && phone && language && pathway;

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
            <Input
              placeholder="Enter patient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Age</label>
            <Input
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              placeholder="+233..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
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
            <Select value={pathway} onValueChange={(v) => setPathway(v as Pathway)}>
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
            <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid}>
              Register Patient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
