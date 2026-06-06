import { MOCK_USER, ROLE_BADGE_VARIANT } from '@/lib/mamacare/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <img
            className="size-16 rounded-full border-2 border-green-500"
            src="https://images.unsplash.com/photo-1677195063105-276fd4b95b21?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User avatar"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{MOCK_USER.name}</span>
              <Badge
                variant={ROLE_BADGE_VARIANT[MOCK_USER.role] as 'primary' | 'success'}
                appearance="light"
                size="sm"
              >
                {MOCK_USER.role}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{MOCK_USER.email}</span>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Full Name</p>
            <p className="text-sm font-medium">{MOCK_USER.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="text-sm font-medium">{MOCK_USER.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Role</p>
            <p className="text-sm font-medium">{MOCK_USER.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Zone</p>
            <p className="text-sm font-medium">Kano Metropolitan</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
