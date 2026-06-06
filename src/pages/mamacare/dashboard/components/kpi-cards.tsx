import { Card, CardContent } from '@/components/ui/card';
import { CountingNumber } from '@/components/ui/counting-number';
import { useMamaCare } from '@/providers/mamacare-provider';
import { kpiData } from '@/lib/mamacare/mock-data';
import { Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export function KpiCards() {
  const { dashboardData } = useMamaCare();
  const data = dashboardData?.kpis || kpiData;

  const cards = [
    {
      label: 'Total Mothers',
      value: data.totalMothers,
      icon: Users,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'High Risk Active',
      value: data.highRisk,
      icon: AlertTriangle,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'Pending Actions',
      value: data.pendingActions,
      icon: Clock,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'Resolution Rate',
      value: data.resolutionRate,
      icon: CheckCircle,
      format: (v: number) => `${Math.round(v)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7.5">
      {cards.map((card) => {
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
