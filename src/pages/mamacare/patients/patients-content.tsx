import { useState, useEffect } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { useMamaCare } from '@/providers/mamacare-provider';
import { usePathway } from '@/providers/pathway-provider';
import { PatientQueue } from './components/patient-queue';
import { PatientDetail } from './components/patient-detail';

export function PatientsContent() {
  const { patients } = useMamaCare();
  const { activePathway } = usePathway();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = patients.filter(p => p.pathway === activePathway);
  
  // Clear selection if selected patient is not in active pathway
  useEffect(() => {
    if (selectedPatientId && !filteredPatients.find(p => p.id === selectedPatientId)) {
      setSelectedPatientId(null);
    }
  }, [activePathway, filteredPatients, selectedPatientId]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-220px)]">
      <ResizablePanel defaultSize={35} minSize={25}>
        <PatientQueue
          patients={filteredPatients}
          selectedId={selectedPatientId}
          onSelect={(p) => setSelectedPatientId(p?.id ?? null)}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65} minSize={40}>
        {selectedPatient ? (
          <PatientDetail patient={selectedPatient} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Select a patient to view details</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
