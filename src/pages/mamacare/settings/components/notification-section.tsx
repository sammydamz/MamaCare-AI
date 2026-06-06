import { useState } from 'react';
import { AlertTriangle, Bell, FileText, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultEnabled: boolean;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: 'risk-escalation',
    label: 'Risk Escalations',
    description: 'Get notified when a patient risk level changes',
    icon: <AlertTriangle className="size-4 text-destructive" />,
    defaultEnabled: true,
  },
  {
    id: 'referral-update',
    label: 'Referral Updates',
    description: 'Notifications when referral statuses change',
    icon: <FileText className="size-4 text-info" />,
    defaultEnabled: true,
  },
  {
    id: 'consultation-reminder',
    label: 'Consultation Reminders',
    description: 'Reminders for scheduled follow-up calls',
    icon: <Phone className="size-4 text-primary" />,
    defaultEnabled: true,
  },
  {
    id: 'daily-digest',
    label: 'Daily Digest',
    description: 'Summary of daily activities and pending actions',
    icon: <Bell className="size-4 text-muted-foreground" />,
    defaultEnabled: false,
  },
];

export function NotificationSection() {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationSettings.map((s) => [s.id, s.defaultEnabled])),
  );

  const toggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive alerts and updates</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {notificationSettings.map((setting, index) => (
          <div key={setting.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {setting.icon}
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <Switch
                checked={settings[setting.id]}
                onCheckedChange={() => toggle(setting.id)}
              />
            </div>
            {index < notificationSettings.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
