import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { Bell, Menu, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { usePathway } from '@/providers/pathway-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Container } from '@/components/common/container';

import { SidebarMenu } from './sidebar-menu';

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
  const { activePathway, setActivePathway } = usePathway();
  const { user } = useAuth();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const scrollPosition = useScrollPosition();
  const headerSticky: boolean = scrollPosition > 0;

  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-transparent bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <Container className="flex justify-between items-stretch lg:gap-4">
        <div className="flex lg:hidden items-center gap-2.5">
          <Link to="/" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo.svg')}
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          <Sheet open={isSidebarSheetOpen} onOpenChange={setIsSidebarSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" mode="icon">
                <Menu className="text-muted-foreground/70" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="p-0 gap-0 w-[275px]"
              side="left"
              close={false}
            >
              <SheetHeader className="p-0 space-y-0" />
              <SheetBody className="p-0 overflow-y-auto">
                <div className="p-4 border-b">
                  <ToggleGroup
                    type="single"
                    value={activePathway}
                    onValueChange={(val) => {
                      if (val) {
                        setActivePathway(
                          val as 'Pregnancy' | 'Postnatal' | 'Post-Loss',
                        );
                        navigate('/');
                        setIsSidebarSheetOpen(false);
                      }
                    }}
                    className="flex flex-col gap-2 bg-muted p-2 rounded-lg border w-full"
                  >
                    <ToggleGroupItem
                      value="Pregnancy"
                      className="w-full rounded-md px-4 py-2 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
                    >
                      Prenatal Care
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Postnatal"
                      className="w-full rounded-md px-4 py-2 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
                    >
                      Postnatal Care
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Post-Loss"
                      className="w-full rounded-md px-4 py-2 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
                    >
                      Post-Loss Support
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <SidebarMenu />
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>



        <div className="flex items-center gap-3">
          <div className="hidden lg:block mr-4">
            <ToggleGroup
              type="single"
              value={activePathway}
              onValueChange={(val) => {
                if (val) {
                  setActivePathway(
                    val as 'Pregnancy' | 'Postnatal' | 'Post-Loss',
                  );
                  navigate('/');
                }
              }}
              className="bg-muted p-1 rounded-full border"
            >
              <ToggleGroupItem
                value="Pregnancy"
                className="rounded-full px-4 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
              >
                Prenatal Care
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Postnatal"
                className="rounded-full px-4 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
              >
                Postnatal Care
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Post-Loss"
                className="rounded-full px-4 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all"
              >
                Post-Loss Support
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="hidden lg:block">
            <SearchDialog
              trigger={
                <Button
                  variant="ghost"
                  mode="icon"
                  shape="circle"
                  className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                >
                  <Search className="size-4.5!" />
                </Button>
              }
            />
          </div>
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <Bell className="size-4.5!" />
              </Button>
            }
          />
          <UserDropdownMenu
            trigger={
              <img
                className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer object-cover"
                src={
                  user?.pic ||
                  'https://images.unsplash.com/photo-1677195063105-276fd4b95b21?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                alt="User Avatar"
              />
            }
          />
        </div>
      </Container>
    </header>
  );
}
