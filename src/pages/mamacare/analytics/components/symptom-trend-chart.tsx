import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMamaCare } from '@/providers/mamacare-provider';

const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#22c55e'];

export function SymptomTrendChart() {
  const { analyticsData } = useMamaCare();
  
  const rawData = analyticsData?.symptomTrend || [
    { month: 'Jan', headache: 4, bleeding: 1, fatigue: 12 },
    { month: 'Feb', headache: 6, bleeding: 2, fatigue: 15 },
    { month: 'Mar', headache: 8, bleeding: 0, fatigue: 10 },
    { month: 'Apr', headache: 12, bleeding: 3, fatigue: 18 },
    { month: 'May', headache: 15, bleeding: 4, fatigue: 20 },
  ];

  const chartData = rawData.map((d: { month?: string; week?: string; headache?: number; bleeding?: number; fatigue?: number }) => ({
    week: d.month || d.week,
    Headache: d.headache || 0,
    Bleeding: d.bleeding || 0,
    Fatigue: d.fatigue || 0,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Headache" stroke={COLORS[0]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Bleeding" stroke={COLORS[1]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Fever" stroke={COLORS[2]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Fatigue" stroke={COLORS[3]} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
