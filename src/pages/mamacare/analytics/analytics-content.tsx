import { AnalyticsKpiCards } from './components/analytics-kpi-cards';
import { ChwPerformanceTable } from './components/chw-performance-table';
import { SymptomTrendChart } from './components/symptom-trend-chart';
import { FacilityPerformanceTable } from './components/facility-performance-table';
import { MelPrimaryOutcomes } from './components/mel-primary-outcomes';
import { MelSecondaryOutcomes } from './components/mel-secondary-outcomes';
import { PostLossMetrics } from './components/post-loss-metrics';
import { usePathway } from '@/providers/pathway-provider';

export function AnalyticsContent() {
  const { activePathway } = usePathway();

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <AnalyticsKpiCards />

      <MelPrimaryOutcomes />

      {activePathway === 'Pregnancy' ? (
        <>
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
            <MelSecondaryOutcomes />
            <SymptomTrendChart />
          </div>
        </>
      ) : activePathway === 'Postnatal' ? (
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
          <MelSecondaryOutcomes />
          <SymptomTrendChart />
        </div>
      ) : (
        <PostLossMetrics />
      )}

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
        <ChwPerformanceTable />
        <FacilityPerformanceTable />
      </div>
    </div>
  );
}
