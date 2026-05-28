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

const symptomTrendData = [
  { week: 'Wk 1', Headache: 12, Bleeding: 4, Fever: 8, Fatigue: 15 },
  { week: 'Wk 2', Headache: 14, Bleeding: 3, Fever: 10, Fatigue: 13 },
  { week: 'Wk 3', Headache: 11, Bleeding: 6, Fever: 7, Fatigue: 16 },
  { week: 'Wk 4', Headache: 16, Bleeding: 5, Fever: 9, Fatigue: 14 },
  { week: 'Wk 5', Headache: 13, Bleeding: 7, Fever: 11, Fatigue: 12 },
  { week: 'Wk 6', Headache: 10, Bleeding: 4, Fever: 6, Fatigue: 11 },
  { week: 'Wk 7', Headache: 8, Bleeding: 3, Fever: 5, Fatigue: 9 },
  { week: 'Wk 8', Headache: 9, Bleeding: 2, Fever: 4, Fatigue: 8 },
];

const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#22c55e'];

export function SymptomTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={symptomTrendData}>
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
