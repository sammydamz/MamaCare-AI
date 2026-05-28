import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { riskEscalationFeed } from '@/lib/mamacare/mock-data';
import { RISK_COLORS } from '@/lib/mamacare/constants';

function formatTimeAgo(dateStr: string): string {
  const now = new Date('2026-05-28T12:00:00Z');
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
}

export function RiskFeed() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Risk Escalation Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-[320px] px-5 pb-5">
          <div className="flex flex-col gap-4">
            {riskEscalationFeed.map((entry) => (
              <div
                key={`${entry.patientId}-${entry.date}`}
                className="flex flex-col gap-1.5 pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{entry.patientName}</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(entry.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={RISK_COLORS[entry.fromLevel] as 'destructive' | 'warning' | 'secondary'} size="sm">
                    {entry.fromLevel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">&rarr;</span>
                  <Badge variant={RISK_COLORS[entry.toLevel] as 'destructive' | 'warning' | 'secondary'} size="sm">
                    {entry.toLevel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{entry.reason}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
