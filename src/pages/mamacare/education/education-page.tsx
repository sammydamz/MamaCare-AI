import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { EducationContent } from '.';

export function EducationPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Education" />
            <ToolbarDescription>
              Clinician-approved lessons delivered on voice calls
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <EducationContent />
      </Container>
    </Fragment>
  );
}
