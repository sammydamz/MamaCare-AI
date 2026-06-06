import { Card, CardContent } from '@/components/ui/card';
import { CountingNumber } from '@/components/ui/counting-number';
import { useMamaCare } from '@/providers/mamacare-provider';
import { Users, Clock, PhoneForwarded, AlertTriangle } from 'lucide-react';

export function AnalyticsKpiCards() {
  const { analyticsData } = useMamaCare();

  const totalReferrals = analyticsData?.kpis.totalReferrals ?? 0;
  const avgResolutionTimeStr = analyticsData?.kpis.avgResolutionTime ?? '0 days';
  const followUpRateStr = analyticsData?.kpis.followUpRate ?? '0%';
  const emergencyEscalations = analyticsData?.kpis.emergencyEscalations ?? 0;

  const avgResolutionTimeValue = parseFloat(avgResolutionTimeStr);
  const followUpRateValue = parseFloat(followUpRateStr);

  const analyticsKpiData = [
    {
      label: 'Total Referrals',
      value: totalReferrals,
      icon: Users,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'Avg Resolution Time',
      value: avgResolutionTimeValue,
      icon: Clock,
      format: (v: number) => `${v.toFixed(1)} ${avgResolutionTimeStr.split(' ')[1] || 'days'}`,
    },
    {
      label: 'Follow-up Rate',
      value: followUpRateValue,
      icon: PhoneForwarded,
      format: (v: number) => `${Math.round(v)}%`,
    },
    {
      label: 'Emergency Escalations',
      value: emergencyEscalations,
      icon: AlertTriangle,
      format: (v: number) => String(Math.round(v)),
    },
  ];

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
