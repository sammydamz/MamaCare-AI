import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { RiskLevel } from '@/lib/mamacare/types';

const RISK_NUMERIC: Record<RiskLevel, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const RISK_LABELS: Record<number, string> = {
  3: 'HIGH',
  2: 'MED',
  1: 'LOW',
};

export function RiskTrendChart({
  riskHistory,
}: {
  riskHistory: { date: string; level: RiskLevel }[];
}) {
  const data = riskHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    value: RISK_NUMERIC[entry.level],
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0.5, 3.5]}
            ticks={[1, 2, 3]}
            tickFormatter={(v: number) => RISK_LABELS[v] ?? ''}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value: number) => [RISK_LABELS[value] ?? value, 'Risk']}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
          <Line
            type="stepAfter"
            dataKey="value"
            stroke="hsl(var(--color-primary-accent, var(--color-blue-600)))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
