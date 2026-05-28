import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { referrals, facilities } from '@/lib/mamacare/mock-data';
import type { Referral } from '@/lib/mamacare/types';
import { ReferralTable } from './components/referral-table';
import { ReferralTimeline } from './components/referral-timeline';
import { FacilityMiniCard } from './components/facility-mini-card';

export function ReferralsContent() {
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = referrals.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter,
  );

  const selectedFacility = selectedReferral
    ? facilities.find((f) => f.id === selectedReferral.facilityId)
    : null;

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Transit">In Transit</SelectItem>
            <SelectItem value="Admitted">Admitted</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Lost to Follow-up">Lost to Follow-up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReferralTable
        referrals={filtered}
        selectedId={selectedReferral?.id ?? null}
        onSelect={setSelectedReferral}
      />

      {selectedReferral && selectedFacility && (
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
          <Card>
            <CardHeader>
              <CardTitle>Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityMiniCard facility={selectedFacility} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Referral Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralTimeline referral={selectedReferral} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
