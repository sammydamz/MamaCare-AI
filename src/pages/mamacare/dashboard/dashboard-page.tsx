import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { DashboardContent } from '.';

export function DashboardPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Clinical Dashboard" />
            <ToolbarDescription>
              MamaCare patient overview and risk monitoring
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
}
