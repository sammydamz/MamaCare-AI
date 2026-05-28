import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { ReferralsContent } from '.';
import { ReferralFormDialog } from './components/referral-form-dialog';

export function ReferralsPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Referrals & Tracking" />
            <ToolbarDescription>
              Track and manage patient referrals to healthcare facilities
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <ReferralFormDialog />
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <ReferralsContent />
      </Container>
    </Fragment>
  );
}
