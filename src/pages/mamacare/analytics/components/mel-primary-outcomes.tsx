import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, CheckCircle } from 'lucide-react';
import { useMamaCare } from '@/providers/mamacare-provider';
import { usePathway } from '@/providers/pathway-provider';
import { useEffect, useState } from 'react';

export function MelPrimaryOutcomes() {
  const { consultations, referrals } = useMamaCare();
  const { activePathway } = usePathway();
  const [metrics, setMetrics] = useState({
    dangerSigns: 0,
    medianTime: '14 mins',
    referralCompletion: '0%'
  });

  useEffect(() => {
    // Danger signs identified = count of consultations with HIGH or MEDIUM risk
    const dangerSignsCount = consultations.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'MEDIUM').length;

    // Referral completion = resolved referrals / total referrals
    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(r => r.status === 'Resolved' || r.status === 'Admitted').length;
    const completionRate = totalReferrals > 0 ? Math.round((completedReferrals / totalReferrals) * 100) : 0;

    setMetrics({
      dangerSigns: dangerSignsCount,
      medianTime: '12 mins',
      referralCompletion: completionRate + '%'
    });
  }, [consultations, referrals]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary Outcome Metrics — {activePathway}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 text-red-900 border border-red-100">
            <Activity className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">Danger Signs Identified</p>
              <h4 className="text-2xl font-bold">{metrics.dangerSigns}</h4>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-700">Median Time to Notification</p>
              <h4 className="text-2xl font-bold">{metrics.medianTime}</h4>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 text-green-900 border border-green-100">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-700">Referral Completion</p>
              <h4 className="text-2xl font-bold">{metrics.referralCompletion}</h4>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
