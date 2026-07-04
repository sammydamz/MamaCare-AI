import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface VoiceTriagePayload {
  title: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  patientId: string;
  patientName: string;
  symptoms: string[];
  summary: string;
  consultationId: string;
  trigger: string;
}

const riskConfig = {
  HIGH: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, badge: 'destructive' as const },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, badge: 'warning' as const },
  LOW: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, badge: 'secondary' as const },
};

export default function ItemVoiceTriage({
  title,
  riskLevel,
  patientName,
  symptoms,
  summary,
}: VoiceTriagePayload) {
  const config = riskConfig[riskLevel] || riskConfig.LOW;
  const Icon = config.icon;

  return (
    <Link to="/sessions" className="block px-5 no-underline">
      <div className={cn('flex gap-3 rounded-lg border p-3', config.color)}>
        <Icon className="size-5 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm truncate">{patientName}</span>
            <Badge variant={config.badge} className="text-[10px] px-1.5 py-0">
              {riskLevel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{summary}</p>
          {symptoms?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {symptoms.slice(0, 3).map((s, i) => (
                <span key={i} className="text-[10px] bg-background/50 rounded px-1.5 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
