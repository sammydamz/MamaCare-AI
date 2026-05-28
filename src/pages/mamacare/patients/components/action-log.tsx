import type { ActionLogEntry } from '@/lib/mamacare/types';
import {
  Stethoscope,
  Phone,
  ArrowRightLeft,
  AlertTriangle,
  ClipboardCheck,
  UserPlus,
  Activity,
} from 'lucide-react';

const TYPE_ICONS: Record<ActionLogEntry['type'], React.ElementType> = {
  Visit: Stethoscope,
  Call: Phone,
  Referral: ArrowRightLeft,
  Alert: AlertTriangle,
  Outcome: ClipboardCheck,
  Registration: UserPlus,
  Vitals: Activity,
};

export function ActionLog({ entries }: { entries: ActionLogEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((entry) => {
        const Icon = TYPE_ICONS[entry.type];
        return (
          <div key={entry.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent">
              <Icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{entry.description}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>{entry.performedBy}</span>
                <span className="text-border">·</span>
                <span>
                  {new Date(entry.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
