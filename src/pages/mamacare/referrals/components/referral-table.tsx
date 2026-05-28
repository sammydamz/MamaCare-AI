import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RISK_COLORS, REFERRAL_STATUS_COLORS } from '@/lib/mamacare/constants';
import type { Referral } from '@/lib/mamacare/types';

export function ReferralTable({
  referrals,
  selectedId,
  onSelect,
}: {
  referrals: Referral[];
  selectedId: string | null;
  onSelect: (r: Referral) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Facility</TableHead>
          <TableHead>Assigned CHW</TableHead>
          <TableHead>Outcome</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow
            key={referral.id}
            className={referral.id === selectedId ? 'bg-muted' : 'cursor-pointer'}
            onClick={() => onSelect(referral)}
          >
            <TableCell className="font-medium">{referral.patientName}</TableCell>
            <TableCell>
              <Badge
                variant={RISK_COLORS[referral.riskLevel] as 'destructive' | 'warning' | 'secondary'}
                appearance="light"
                size="sm"
              >
                {referral.riskLevel}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={REFERRAL_STATUS_COLORS[referral.status] as 'warning' | 'info' | 'destructive' | 'secondary'}
                appearance="light"
                size="sm"
              >
                {referral.status}
              </Badge>
            </TableCell>
            <TableCell>{referral.facilityName}</TableCell>
            <TableCell>{referral.assignedChw}</TableCell>
            <TableCell className="text-muted-foreground">
              {referral.outcome ?? '—'}
            </TableCell>
          </TableRow>
        ))}
        {referrals.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No referrals found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
