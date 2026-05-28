import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { facilities } from '@/lib/mamacare/mock-data';
import { FacilityCard } from './components/facility-card';

export function FacilitiesContent() {
  const [search, setSearch] = useState('');

  const filtered = facilities.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search facilities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7.5">
        {filtered.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>
    </div>
  );
}
