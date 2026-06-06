import { useAuth } from '@/auth/context/auth-context';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DangerZoneSection() {
  const { logout } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Account</CardTitle>
          <CardDescription>Sign out of your account</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="size-4" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
