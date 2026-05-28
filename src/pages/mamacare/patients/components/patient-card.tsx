import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { RISK_COLORS } from '@/lib/mamacare/constants';
import type { Patient, RiskLevel } from '@/lib/mamacare/types';

const RISK_BADGE_VARIANT: Record<RiskLevel, BadgeProps['variant']> = {
  HIGH: RISK_COLORS.HIGH as BadgeProps['variant'],
  MEDIUM: RISK_COLORS.MEDIUM as BadgeProps['variant'],
  LOW: RISK_COLORS.LOW as BadgeProps['variant'],
};

export function PatientCard({
  patient,
  selected,
  onClick,
}: {
  patient: Patient;
  selected: boolean;
  onClick: () => void;
}) {
  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
        selected ? 'border-primary bg-accent' : 'border-border'
      }`}
    >
      <Avatar className="size-9">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">{patient.name}</span>
          <Badge variant={RISK_BADGE_VARIANT[patient.riskLevel]} size="sm">
            {patient.riskLevel}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          <span>{patient.pathway}</span>
          <span className="text-border">|</span>
          <span>{patient.stage}</span>
        </div>
      </div>
    </button>
  );
}
