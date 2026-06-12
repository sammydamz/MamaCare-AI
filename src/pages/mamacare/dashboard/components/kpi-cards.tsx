import { Card, CardContent } from '@/components/ui/card';
import { CountingNumber } from '@/components/ui/counting-number';
import { useMamaCare } from '@/providers/mamacare-provider';
import { usePathway } from '@/providers/pathway-provider';
import { Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export function KpiCards() {
  const { patients } = useMamaCare();
  const { activePathway } = usePathway();

  const filteredPatients = patients.filter(p => p.pathway === activePathway);
  
  const totalMothers = filteredPatients.length;
  const highRisk = filteredPatients.filter(p => p.riskLevel === 'HIGH').length;
  const pendingActions = Math.floor(totalMothers * 0.4); // Mock data for demo
  const resolutionRate = activePathway === 'Pregnancy' ? 78 : 92; // Mock data for demo

  const cards = [
    {
      label: activePathway === 'Pregnancy' ? 'Total Mothers' : 'Total Mothers Supported',
      value: totalMothers,
      icon: Users,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'High Risk Active',
      value: highRisk,
      icon: AlertTriangle,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'Pending Actions',
      value: pendingActions,
      icon: Clock,
      format: (v: number) => String(Math.round(v)),
    },
    {
      label: 'Resolution Rate',
      value: resolutionRate,
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
