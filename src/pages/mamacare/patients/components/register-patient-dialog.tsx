import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  CONDITIONS_OPTIONS,
  LANGUAGE_LABELS,
  PATHWAY_LABELS,
  TRIMESTER_OPTIONS,
} from '@/lib/mamacare/constants';
import type { Pathway } from '@/lib/mamacare/types';
import { useMamaCare } from '@/providers/mamacare-provider';
import { usePathway } from '@/providers/pathway-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateFieldInput } from '@/components/ui/date-field-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RegisterPatientDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('');
  const [address, setAddress] = useState('');
  const [trimester, setTrimester] = useState('');
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [lmpDate, setLmpDate] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [otherConditions, setOtherConditions] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const { activePathway } = usePathway();
  const [pathway, setPathway] = useState<Pathway | ''>(activePathway);
  const { registerPatient } = useMamaCare();

  useEffect(() => {
    if (open) {
      setPathway(activePathway);
    }
  }, [open, activePathway]);

  const handleSubmit = async () => {
    if (!name || !age || !phone || !language || !pathway) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const defaultStage =
        pathway === 'Pregnancy'
          ? '12 weeks'
          : pathway === 'Postnatal'
            ? '6 weeks postpartum'
            : 'Post-loss: 1 month';
      await registerPatient({
        name,
        age: parseInt(age),
        pathway,
        language,
        stage: defaultStage,
        phone,
        address,
        trimester: trimester as 'first' | 'second' | 'third' | undefined,
        gestationalWeeks: gestationalWeeks
          ? parseInt(gestationalWeeks)
          : undefined,
        lmpDate,
        conditions: conditions.length > 0 ? conditions : undefined,
        otherConditions: otherConditions || undefined,
        emergencyContact,
        emergencyPhone,
        occupation,
        allergies,
        currentMedications,
      });
      toast.success('Patient registered successfully');
      setOpen(false);
      setName('');
      setAge('');
      setPhone('');
      setLanguage('');
      setPathway('');
      setAddress('');
      setTrimester('');
      setGestationalWeeks('');
      setLmpDate('');
      setConditions([]);
      setOtherConditions('');
      setEmergencyContact('');
      setEmergencyPhone('');
      setOccupation('');
      setAllergies('');
      setCurrentMedications('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to register patient. Please try again.');
    }
  };

  const isFormValid = name && age && phone && language && pathway;

  const toggleCondition = (value: string) => {
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          + Register
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Add a new patient to the MamaCare programme.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {/* ── Demographics ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Full Name</Label>
            <Input
              placeholder="Enter patient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Age</Label>
            <Input
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="+233..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Location / Address</Label>
            <Input
              placeholder="Enter patient address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Language</Label>
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
              <Label>Occupation</Label>
              <Input
                placeholder="Enter occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
          </div>

          {/* ── Pregnancy Details ── */}
          {pathway === 'Pregnancy' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Trimester</Label>
                  <Select value={trimester} onValueChange={setTrimester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trimester" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIMESTER_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {trimester && (
                  <div className="flex flex-col gap-1.5">
                    <Label>Gestational Weeks</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 24"
                      value={gestationalWeeks}
                      onChange={(e) => setGestationalWeeks(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <DateFieldInput
                  label="Last Menstrual Period (LMP)"
                  value={lmpDate}
                  onValueChange={setLmpDate}
                  hint="EDD auto-calculated from LMP."
                />
              </div>
            </>
          )}

          {/* ── Conditions ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Conditions / Comorbidities</Label>
            <div className="flex flex-wrap gap-3">
              {CONDITIONS_OPTIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <Checkbox
                    checked={conditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <span className="text-sm">{condition}</span>
                </label>
              ))}
            </div>
            <Input
              placeholder="Other conditions (specify)"
              value={otherConditions}
              onChange={(e) => setOtherConditions(e.target.value)}
            />
          </div>

          {/* ── Allergies & Medications ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Allergies</Label>
              <Input
                placeholder="Known allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Current Medications</Label>
              <Input
                placeholder="Current medications"
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
              />
            </div>
          </div>

          {/* ── Emergency Contact ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Emergency Contact</Label>
              <Input
                placeholder="Contact name"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Emergency Phone</Label>
              <Input
                type="tel"
                placeholder="Contact number"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>

          {/* ── Pathway (pre-filled) ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Pathway</Label>
            <Select
              value={pathway}
              onValueChange={(v) => setPathway(v as Pathway)}
              disabled
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PATHWAY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Pre-filled from active pathway. Change pathway from the patient
              detail panel after registration.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Register Patient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
