import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Toggle between light and dark mode</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="size-5 text-muted-foreground" />
            ) : (
              <Sun className="size-5 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                {theme === 'dark' ? 'Currently active' : 'Switch to dark theme'}
              </p>
            </div>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
