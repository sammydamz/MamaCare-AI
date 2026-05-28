import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RISK_COLORS } from '@/lib/mamacare/constants';
import type { Patient, RiskLevel } from '@/lib/mamacare/types';
import { consultations, actionLog } from '@/lib/mamacare/mock-data';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { RiskTrendChart } from './risk-trend-chart';
import { ActionLog } from './action-log';
import { LogVisitDialog } from './log-visit-dialog';
import { CreateReferralDialog } from './create-referral-dialog';
import { RecordVitalsDialog } from './record-vitals-dialog';

const RISK_BADGE_VARIANT: Record<RiskLevel, BadgeProps['variant']> = {
  HIGH: RISK_COLORS.HIGH as BadgeProps['variant'],
  MEDIUM: RISK_COLORS.MEDIUM as BadgeProps['variant'],
  LOW: RISK_COLORS.LOW as BadgeProps['variant'],
};

function RiskTrendArrow({ history }: { history: { level: RiskLevel }[] }) {
  if (history.length < 2) return <Minus className="size-4 text-muted-foreground" />;
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
  const latest = history[history.length - 1].level;
  const prev = history[history.length - 2].level;
  if (order[latest] < order[prev]) {
    return <ArrowUp className="size-4 text-destructive" />;
  }
  if (order[latest] > order[prev]) {
    return <ArrowDown className="size-4 text-green-600" />;
  }
  return <Minus className="size-4 text-muted-foreground" />;
}

export function PatientDetail({ patient }: { patient: Patient }) {
  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const latestConsultation = consultations
    .filter((c) => c.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const patientActions = actionLog.filter(
    (a) => a.patientId === patient.id,
  );

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{patient.name}</h2>
              <Badge variant={RISK_BADGE_VARIANT[patient.riskLevel]} size="sm">
                {patient.riskLevel}
              </Badge>
              <RiskTrendArrow history={patient.riskHistory} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span>{patient.pathway}</span>
              <span className="text-border">·</span>
              <span>{patient.stage}</span>
              <span className="text-border">·</span>
              <span>{patient.language}</span>
              <span className="text-border">·</span>
              <span>CHW: {patient.assignedChw}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Risk Trend</h3>
          <RiskTrendChart riskHistory={patient.riskHistory} />
        </div>

        {latestConsultation && (
          <div>
            <h3 className="text-sm font-medium mb-2">Latest Consultation</h3>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>{new Date(latestConsultation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-border">·</span>
                <span>{latestConsultation.language}</span>
              </div>
              <p className="text-sm">{latestConsultation.aiSummary}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-3">Action Log</h3>
          <ActionLog entries={patientActions} />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <LogVisitDialog />
          <CreateReferralDialog />
          <RecordVitalsDialog pathway={patient.pathway} />
        </div>
      </div>
    </ScrollArea>
  );
}
