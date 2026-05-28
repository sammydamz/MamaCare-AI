import { KpiCards } from './components/kpi-cards';
import { RiskFeed } from './components/risk-feed';
import { ZoneSummary } from './components/zone-summary';

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <KpiCards />

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5">
        <div className="lg:col-span-1">
          <ZoneSummary />
        </div>
        <div className="lg:col-span-2">
          <RiskFeed />
        </div>
      </div>
    </div>
  );
}
