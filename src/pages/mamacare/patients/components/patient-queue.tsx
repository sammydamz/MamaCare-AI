import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RISK_ORDER } from '@/lib/mamacare/constants';
import type { Patient } from '@/lib/mamacare/types';
import { PatientCard } from './patient-card';
import { RegisterPatientDialog } from './register-patient-dialog';

export function PatientQueue({
  patients,
  selectedId,
  onSelect,
}: {
  patients: Patient[];
  selectedId: string | null;
  onSelect: (p: Patient) => void;
}) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filtered = patients
    .filter((p) => {
      if (tab === 'pregnancy') return p.pathway === 'Pregnancy';
      if (tab === 'post-loss') return p.pathway === 'Post-Loss';
      return true;
    })
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((p) => riskFilter === 'all' || p.riskLevel === riskFilter)
    .sort(
      (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel],
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 pb-3">
        <div className="flex-1">
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="HIGH">HIGH</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
            <SelectItem value="LOW">LOW</SelectItem>
          </SelectContent>
        </Select>
        <RegisterPatientDialog />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="px-3">
          <TabsList variant="line" size="sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
            <TabsTrigger value="post-loss">Post-Loss</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={tab} className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full px-3 py-2">
            <div className="flex flex-col gap-2">
              {filtered.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  selected={patient.id === selectedId}
                  onClick={() => onSelect(patient)}
                />
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No patients found
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
