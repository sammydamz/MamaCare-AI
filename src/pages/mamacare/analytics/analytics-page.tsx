import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { AnalyticsContent } from '.';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePathway } from '@/providers/pathway-provider';

export function AnalyticsPage() {
  const { activePathway } = usePathway();

  const handleExport = () => {
    window.open('/api/export/analytics', '_blank');
  };

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Analytics & Reports" />
            <ToolbarDescription>
              {activePathway} pathway performance metrics and trend analysis
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4" />
              Export
            </Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <AnalyticsContent />
      </Container>
    </Fragment>
  );
}
