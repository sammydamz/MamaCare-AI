import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMamaCare } from '@/providers/mamacare-provider';
import { usePathway } from '@/providers/pathway-provider';
import { RISK_COLORS } from '@/lib/mamacare/constants';
import type { Consultation } from '@/lib/mamacare/types';
import { ConsultationDetail } from './components/consultation-detail';

export function ConsultationsContent() {
  const { consultations, patients } = useMamaCare();
  const { activePathway } = usePathway();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [patientFilter, setPatientFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const pathwayConsultations = consultations.filter(c => {
    const patient = patients.find(p => p.id === c.patientId);
    return patient?.pathway === activePathway;
  });

  const patientNames = Array.from(new Set(pathwayConsultations.map((c) => c.patientName)));

  const filtered = pathwayConsultations.filter((c) => {
    if (patientFilter !== 'all' && c.patientName !== patientFilter) return false;
    if (riskFilter !== 'all' && c.riskLevel !== riskFilter) return false;
    return true;
  });

  function handleRowClick(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div className="flex items-center gap-3">
        <Select value={patientFilter} onValueChange={setPatientFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            {patientNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="HIGH">HIGH</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
            <SelectItem value="LOW">LOW</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Symptoms</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>AI Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((consultation) => (
            <ConsultationRow
              key={consultation.id}
              consultation={consultation}
              isExpanded={expandedId === consultation.id}
              onToggle={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ConsultationRow({
  consultation,
  isExpanded,
  onToggle,
}: {
  consultation: Consultation;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) {
  const riskVariant = RISK_COLORS[consultation.riskLevel] as 'destructive' | 'warning' | 'secondary';
  const isHighRisk = consultation.riskLevel === 'HIGH';
  const isMediumRisk = consultation.riskLevel === 'MEDIUM';

  return (
    <>
      <TableRow
        className={`cursor-pointer ${isHighRisk ? 'bg-red-50/50 hover:bg-red-50' : isMediumRisk ? 'bg-amber-50/50 hover:bg-amber-50' : ''}`}
        onClick={() => onToggle(consultation.id)}
      >
        <TableCell className="whitespace-nowrap">{consultation.date}</TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {consultation.patientName}
            {isHighRisk && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">ALERT</Badge>}
          </div>
        </TableCell>
        <TableCell>{consultation.language}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {consultation.symptoms?.length > 0 ? (
              consultation.symptoms.map((symptom) => (
                <Badge key={symptom} variant="outline" size="sm" className="capitalize text-xs bg-white">
                  {symptom}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">None</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={riskVariant} appearance={isHighRisk || isMediumRisk ? 'default' : 'light'} size="sm" className={isHighRisk ? 'animate-pulse' : ''}>
            {consultation.riskLevel}
          </Badge>
        </TableCell>
        <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
          {consultation.aiSummary}
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <ConsultationDetail consultation={consultation} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
