import { useState } from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGE_LABELS } from '@/lib/mamacare/constants';
import type { Language } from '@/lib/mamacare/types';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSection() {
  const [language, setLanguage] = useState<Language>('English');

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Language</CardTitle>
          <CardDescription>Preferred language for consultations and AI interactions</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Globe className="size-5 text-muted-foreground shrink-0" />
          <div className="grow">
            <p className="text-sm font-medium mb-2">Consultation Language</p>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
