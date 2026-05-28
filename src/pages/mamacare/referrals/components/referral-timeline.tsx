import type { Referral } from '@/lib/mamacare/types';

export function ReferralTimeline({ referral }: { referral: Referral }) {
  return (
    <div className="flex flex-col gap-0">
      {referral.timeline.map((entry, index) => {
        const isLast = index === referral.timeline.length - 1;
        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="size-3 rounded-full bg-primary shrink-0 mt-1" />
              {!isLast && <div className="w-px grow bg-border" />}
            </div>
            <div className={`pb-6 ${isLast ? '' : ''}`}>
              <p className="text-sm font-medium text-foreground">{entry.stage}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(entry.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {entry.note && (
                <p className="text-xs text-secondary-foreground mt-1">{entry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
