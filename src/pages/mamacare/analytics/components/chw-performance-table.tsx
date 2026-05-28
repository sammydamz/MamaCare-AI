import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chwPerformanceData } from '@/lib/mamacare/mock-data';
import { ArrowUpDown } from 'lucide-react';

export function ChwPerformanceTable() {
  const [sortBy, setSortBy] = useState<'followUpRate' | 'totalCases'>('followUpRate');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...chwPerformanceData].sort((a, b) => {
    const diff = a[sortBy] - b[sortBy];
    return sortAsc ? diff : -diff;
  });

  function handleSort(column: 'followUpRate' | 'totalCases') {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CHW Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CHW Name</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('totalCases')}
              >
                <span className="flex items-center gap-1">
                  Total Cases
                  <ArrowUpDown className="size-3" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('followUpRate')}
              >
                <span className="flex items-center gap-1">
                  Follow-up Rate (%)
                  <ArrowUpDown className="size-3" />
                </span>
              </TableHead>
              <TableHead>Resolved</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((chw) => (
              <TableRow key={chw.chwName}>
                <TableCell className="font-medium">{chw.chwName}</TableCell>
                <TableCell>{chw.totalCases}</TableCell>
                <TableCell>{chw.followUpRate}%</TableCell>
                <TableCell>{chw.resolvedCases}</TableCell>
                <TableCell>{chw.activeCases}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
