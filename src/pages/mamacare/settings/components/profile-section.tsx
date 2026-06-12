import { useAuth } from '@/auth/context/auth-context';
import { ROLE_BADGE_VARIANT } from '@/lib/mamacare/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function ProfileSection() {
  const { user } = useAuth();
  
  if (!user) return null;

  const roleName = user.is_admin ? 'Admin' : 'Provider';
  const fullName = user.fullname || `${user.first_name} ${user.last_name}`;

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
            src={user.pic || "https://images.unsplash.com/photo-1677195063105-276fd4b95b21?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            alt="User avatar"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{fullName}</span>
              <Badge
                variant={ROLE_BADGE_VARIANT[roleName] as 'primary' | 'success'}
                appearance="light"
                size="sm"
              >
                {roleName}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Full Name</p>
            <p className="text-sm font-medium">{fullName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Role</p>
            <p className="text-sm font-medium">{roleName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Zone</p>
            <p className="text-sm font-medium">{user.company_name || 'Kano Metropolitan'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
