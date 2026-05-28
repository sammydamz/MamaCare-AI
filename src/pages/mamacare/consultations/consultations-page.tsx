import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { ConsultationsContent } from '.';

export function ConsultationsPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Voice Consultations" />
            <ToolbarDescription>
              AI-powered voice consultations and health assessments
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <ConsultationsContent />
      </Container>
    </Fragment>
  );
}
