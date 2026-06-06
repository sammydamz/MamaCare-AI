import { useParams, Link } from 'react-router-dom';
import { useMamaCare } from '@/providers/mamacare-provider';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PatientProfileContent } from './patient-profile-content';

export function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { patients } = useMamaCare();
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-lg text-muted-foreground">Patient not found</p>
          <Button variant="outline" mode="link" asChild>
            <Link to="/patients">Back to Patients</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" mode="icon" asChild>
          <Link to="/patients">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">{patient.name}</h1>
      </div>
      <PatientProfileContent patient={patient} />
    </Container>
  );
}
