import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const facilityPerformanceData = [
  { name: 'Maitama District Hospital', referrals: 8, resolved: 6, successRate: 75, trend: 'up' as const },
  { name: 'National Hospital Abuja', referrals: 12, resolved: 10, successRate: 83, trend: 'up' as const },
  { name: 'Lagos University Teaching Hospital', referrals: 5, resolved: 4, successRate: 80, trend: 'flat' as const },
  { name: 'Enugu State University Teaching Hospital', referrals: 3, resolved: 3, successRate: 100, trend: 'up' as const },
];

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp className="size-4 text-green-600" />;
  if (trend === 'down') return <TrendingDown className="size-4 text-red-600" />;
  return <Minus className="size-4 text-muted-foreground" />;
}

export function FacilityPerformanceTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility Name</TableHead>
              <TableHead>Total Referrals</TableHead>
              <TableHead>Resolved</TableHead>
              <TableHead>Success Rate (%)</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilityPerformanceData.map((facility) => (
              <TableRow key={facility.name}>
                <TableCell className="font-medium">{facility.name}</TableCell>
                <TableCell>{facility.referrals}</TableCell>
                <TableCell>{facility.resolved}</TableCell>
                <TableCell>{facility.successRate}%</TableCell>
                <TableCell>
                  <TrendIcon trend={facility.trend} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
