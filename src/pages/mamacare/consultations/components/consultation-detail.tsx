import { Badge } from '@/components/ui/badge';
import type { Consultation } from '@/lib/mamacare/types';
import { RISK_COLORS } from '@/lib/mamacare/constants';

export function ConsultationDetail({ consultation }: { consultation: Consultation }) {
  const riskVariant = RISK_COLORS[consultation.riskLevel] as 'destructive' | 'warning' | 'secondary';

  return (
    <div className="p-5 space-y-5 bg-muted/30">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">AI Summary</h4>
          <p className="text-sm leading-relaxed">{consultation.aiSummary}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Assessment</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <Badge variant={riskVariant} appearance="light" size="sm">
                {consultation.riskLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Referral Triggered:</span>
              {consultation.triggeredReferral ? (
                <Badge variant="destructive" appearance="light" size="sm">Yes</Badge>
              ) : (
                <Badge variant="secondary" size="sm">No</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Language:</span>
              <Badge variant="outline" size="sm">{consultation.language}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Transcript</h4>
        <div className="space-y-2">
          {consultation.transcript.map((entry, index) => (
            <div
              key={index}
              className={`flex ${entry.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                  entry.speaker === 'AI'
                    ? 'bg-primary/10 text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <span className="text-xs font-medium block mb-1 opacity-70">
                  {entry.speaker === 'AI' ? 'AI Assistant' : 'Mother'}
                </span>
                {entry.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {consultation.triggeredReferral && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-destructive">Emergency referral was triggered during this consultation.</span>
          </div>
        </div>
      )}
    </div>
  );
}
