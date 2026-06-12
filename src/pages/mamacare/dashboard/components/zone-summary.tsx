import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMamaCare } from '@/providers/mamacare-provider';
import { RISK_COLORS, RISK_ORDER } from '@/lib/mamacare/constants';
import type { RiskLevel } from '@/lib/mamacare/types';

const RISK_LABELS: Record<RiskLevel, string> = {
  HIGH: 'HIGH',
  MEDIUM: 'MED',
  LOW: 'LOW',
};

import { usePathway } from '@/providers/pathway-provider';

export function ZoneSummary() {
  const { patients: contextPatients } = useMamaCare();
  const { activePathway } = usePathway();
  
  const patientsList = contextPatients.filter(p => p.pathway === activePathway);
  
  const summary = {
    caseload: patientsList.length,
    pendingVisits: Math.floor(patientsList.length * 0.4),
    unresolvedDanger: patientsList.filter(p => p.riskLevel === 'HIGH').length,
  };

  const sortedPatients = [...patientsList]
    .sort((a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel])
    .slice(0, 5); // Show top 5 priority patients

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Zone Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Caseload</span>
            <span className="text-sm font-semibold">{summary.caseload}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending Visits</span>
            <span className="text-sm font-semibold">{summary.pendingVisits}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Unresolved Danger</span>
            <span className="text-sm font-semibold text-destructive">{summary.unresolvedDanger}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Top Priority Queue
          </span>
          <div className="flex flex-col gap-2">
            {sortedPatients.map((patient, index) => (
              <div
                key={patient.id}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground w-4">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium">{patient.name}</span>
                </div>
                <Badge
                  variant={RISK_COLORS[patient.riskLevel] as 'destructive' | 'warning' | 'secondary'}
                  size="sm"
                >
                  {RISK_LABELS[patient.riskLevel]}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
