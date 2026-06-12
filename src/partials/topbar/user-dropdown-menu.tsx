import { ReactNode } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import {
  Moon,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { MOCK_USER, ROLE_BADGE_VARIANT } from '@/lib/mamacare/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const displayAvatar = user?.pic || 'https://images.unsplash.com/photo-1677195063105-276fd4b95b21?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="size-9 rounded-full border-2 border-green-500 object-cover"
              src={displayAvatar}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <span className="text-sm text-mono font-semibold">
                {user?.fullname || user?.username || MOCK_USER.name}
              </span>
              <span className="text-xs text-muted-foreground truncate w-32">
                {user?.email || MOCK_USER.email}
              </span>
            </div>
          </div>
          <Badge
            variant={ROLE_BADGE_VARIANT[MOCK_USER.role] as 'primary' | 'success'}
            appearance="light"
            size="sm"
          >
            {MOCK_USER.role}
          </Badge>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex items-center gap-2 justify-between grow">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
