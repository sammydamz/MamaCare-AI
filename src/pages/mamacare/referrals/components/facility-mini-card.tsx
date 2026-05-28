import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import type { Facility } from '@/lib/mamacare/types';

export function FacilityMiniCard({ facility }: { facility: Facility }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h4 className="text-sm font-semibold text-foreground">{facility.name}</h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{facility.distance}</span>
          <span>{facility.hours}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {facility.services.map((service) => (
          <Badge key={service} variant="outline" size="sm" appearance="outline">
            {service}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{facility.phone}</span>
        <Button variant="outline" size="sm" asChild>
          <a href={`tel:${facility.phone}`}>
            <Phone className="size-3.5" />
            Call
          </a>
        </Button>
      </div>
    </div>
  );
}
