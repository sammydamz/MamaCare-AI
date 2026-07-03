import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface OutcomeData {
  metricType: string;
  value: string;
}

export function MelSecondaryOutcomes() {
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from /api/outcomes
    // For the prototype, we can simulate fetching the DHIMS2 metrics
    const fetchOutcomes = async () => {
      try {
        const res = await fetch('/api/outcomes');
        if (res.ok) {
          const data = await res.json();
          setOutcomes(data);
        }
      } catch (err) {
        console.error('Failed to fetch outcomes', err);
      }
    };
    fetchOutcomes();
  }, []);

  const getMetricCount = (type: string) => {
    return outcomes.filter(o => o.metricType === type).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Secondary Clinical Indicators
          <Badge variant="outline">DHIMS2 Linked</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm font-medium">Severe Maternal Morbidity</span>
            <span className="font-bold">{getMetricCount('severe_maternal_morbidity')}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm font-medium">Preterm Birth</span>
            <span className="font-bold">{getMetricCount('preterm_birth')}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm font-medium">Stillbirth</span>
            <span className="font-bold">{getMetricCount('stillbirth')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">NICU Admission</span>
            <span className="font-bold">{getMetricCount('nicu_admission')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
