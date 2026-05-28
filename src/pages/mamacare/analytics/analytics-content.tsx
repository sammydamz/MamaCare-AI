import { AnalyticsKpiCards } from './components/analytics-kpi-cards';
import { ChwPerformanceTable } from './components/chw-performance-table';
import { SymptomTrendChart } from './components/symptom-trend-chart';
import { FacilityPerformanceTable } from './components/facility-performance-table';

export function AnalyticsContent() {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <AnalyticsKpiCards />

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
        <ChwPerformanceTable />
        <SymptomTrendChart />
      </div>

      <FacilityPerformanceTable />
    </div>
  );
}
