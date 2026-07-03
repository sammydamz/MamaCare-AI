import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useMamaCare } from '@/providers/mamacare-provider';
import { Heart, Brain, Users, TrendingUp } from 'lucide-react';

export function PostLossMetrics() {
  const { patients, consultations } = useMamaCare();
  const [metrics, setMetrics] = useState({
    avgCopingIndex: 'N/A',
    counsellingFollowUp: 0,
    supportGroupActive: 0,
    improvedScore: 0,
  });

  useEffect(() => {
    const postLoss = patients.filter(p => p.pathway === 'Post-Loss');

    const withCoping = postLoss.filter(p => p.copingIndex != null);
    const avgCoping = withCoping.length
      ? (withCoping.reduce((s, p) => s + (p.copingIndex || 0), 0) / withCoping.length).toFixed(1)
      : 'N/A';

    const improved = withCoping.filter(p => (p.copingIndex || 0) >= 6).length;
    const counsellingReferrals = consultations.filter(c =>
      c.aiSummary?.toLowerCase().includes('counselling')
    ).length;

    setMetrics({
      avgCopingIndex: String(avgCoping),
      counsellingFollowUp: counsellingReferrals,
      supportGroupActive: postLoss.length,
      improvedScore: improved,
    });
  }, [patients, consultations]);

  return (
    <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
      <Card>
        <CardHeader>
          <CardTitle>Post-Loss Recovery Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-100">
              <Heart className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-xs text-purple-700 font-medium">Avg Coping Index</p>
                <h4 className="text-xl font-bold">{metrics.avgCopingIndex}/10</h4>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
              <Brain className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-xs text-blue-700 font-medium">Counselling Sessions</p>
                <h4 className="text-xl font-bold">{metrics.counsellingFollowUp}</h4>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
              <Users className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-xs text-green-700 font-medium">Support Group Active</p>
                <h4 className="text-xl font-bold">{metrics.supportGroupActive}</h4>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-teal-50 border border-teal-100">
              <TrendingUp className="h-6 w-6 text-teal-500" />
              <div>
                <p className="text-xs text-teal-700 font-medium">Improved (6+)</p>
                <h4 className="text-xl font-bold">{metrics.improvedScore}</h4>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Mental Health Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Grief Assessment Completed</span>
              <span className="font-bold text-purple-600">{metrics.supportGroupActive}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Counselling Referrals</span>
              <span className="font-bold text-blue-600">{metrics.counsellingFollowUp}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Coping Index &ge; 6</span>
              <span className="font-bold text-green-600">{metrics.improvedScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Support Group</span>
              <span className="font-bold text-teal-600">{metrics.supportGroupActive}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
