import { Card, CardContent } from '@/components/ui/card';
import { CountingNumber } from '@/components/ui/counting-number';
import { Users, Clock, PhoneForwarded, AlertTriangle } from 'lucide-react';

const analyticsKpiData = [
  {
    label: 'Total Referrals',
    value: 24,
    icon: Users,
    format: (v: number) => String(Math.round(v)),
  },
  {
    label: 'Avg Resolution Time',
    value: 3.2,
    icon: Clock,
    format: (v: number) => `${v.toFixed(1)} days`,
  },
  {
    label: 'Follow-up Rate',
    value: 87,
    icon: PhoneForwarded,
    format: (v: number) => `${Math.round(v)}%`,
  },
  {
    label: 'Emergency Escalations',
    value: 5,
    icon: AlertTriangle,
    format: (v: number) => String(Math.round(v)),
  },
];

export function AnalyticsKpiCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7.5">
      {analyticsKpiData.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4">
              <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <span className="text-2xl font-semibold leading-none">
                  <CountingNumber to={card.value} duration={1.5} format={card.format} />
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
