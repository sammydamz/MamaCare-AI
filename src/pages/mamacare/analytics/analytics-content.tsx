import { AnalyticsKpiCards } from './components/analytics-kpi-cards';
import { ChwPerformanceTable } from './components/chw-performance-table';
import { SymptomTrendChart } from './components/symptom-trend-chart';
import { FacilityPerformanceTable } from './components/facility-performance-table';
import { MelPrimaryOutcomes } from './components/mel-primary-outcomes';
import { MelSecondaryOutcomes } from './components/mel-secondary-outcomes';

export function AnalyticsContent() {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <AnalyticsKpiCards />
      
      <MelPrimaryOutcomes />

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
        <MelSecondaryOutcomes />
        <SymptomTrendChart />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
        <ChwPerformanceTable />
        <FacilityPerformanceTable />
      </div>
    </div>
  );
}
