import { ProfileSection } from './components/profile-section';
import { AppearanceSection } from './components/appearance-section';
import { NotificationSection } from './components/notification-section';
import { LanguageSection } from './components/language-section';
import { DangerZoneSection } from './components/danger-zone-section';

export function SettingsContent() {
  return (
    <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="lg:col-span-2 flex flex-col gap-5 lg:gap-7.5">
        <ProfileSection />
        <NotificationSection />
        <LanguageSection />
      </div>
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <AppearanceSection />
        <DangerZoneSection />
      </div>
    </div>
  );
}
