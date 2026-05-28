import { useState } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { patients } from '@/lib/mamacare/mock-data';
import type { Patient } from '@/lib/mamacare/types';
import { PatientQueue } from './components/patient-queue';
import { PatientDetail } from './components/patient-detail';

export function PatientsContent() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-220px)]">
      <ResizablePanel defaultSize={35} minSize={25}>
        <PatientQueue
          patients={patients}
          selectedId={selectedPatient?.id ?? null}
          onSelect={setSelectedPatient}
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
