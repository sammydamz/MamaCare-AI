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
  
  const rawData = analyticsData?.symptomTrend || [];

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
