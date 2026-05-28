import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { FacilitiesContent } from '.';
import { FacilityFormDialog } from './components/facility-form-dialog';

export function FacilitiesPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Health Facilities" />
            <ToolbarDescription>
              Browse and manage healthcare facilities in the network
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <FacilityFormDialog />
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <FacilitiesContent />
      </Container>
    </Fragment>
  );
}
