import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import type { Facility } from '@/lib/mamacare/types';

export function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{facility.name}</CardTitle>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{facility.distance}</span>
          <span>{facility.hours}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {facility.services.map((service) => (
            <Badge key={service} variant="outline" size="sm" appearance="outline">
              {service}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${facility.phone}`}>
              <Phone className="size-3.5" />
              Call
            </a>
          </Button>
          <Button size="sm">
            Refer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
