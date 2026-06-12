import { ReactNode, useEffect, useState } from 'react';
import { Calendar, Settings, Settings2, Shield, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Item1 from './notifications/item-1';
import Item2 from './notifications/item-2';
import Item3 from './notifications/item-3';
import Item4 from './notifications/item-4';
import Item5 from './notifications/item-5';
import Item6 from './notifications/item-6';
import Item10 from './notifications/item-10';
import Item11 from './notifications/item-11';
import Item13 from './notifications/item-13';
import Item14 from './notifications/item-14';
import Item15 from './notifications/item-15';
import Item16 from './notifications/item-16';
import Item17 from './notifications/item-17';
import Item18 from './notifications/item-18';
import Item19 from './notifications/item-19';
import Item20 from './notifications/item-20';

import { usePathway } from '@/providers/pathway-provider';
import { mamacareApi as api } from '@/lib/mamacare/api';
import { AppNotification } from '@/lib/mamacare/types';
import { cn } from '@/lib/utils';

const COMPONENT_MAP: Record<string, any> = {
  Item1, Item2, Item3, Item4, Item5, Item6,
  Item10, Item11, Item13, Item14, Item15,
  Item16, Item17, Item18, Item19, Item20
};

export function NotificationsSheet({ trigger }: { trigger: ReactNode }) {
  const { activePathway } = usePathway();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await api.fetchNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    for (const notif of notifications) {
      if (!notif.isRead) await handleMarkAsRead(notif.id);
    }
  };

  const filteredNotifs = notifications.filter(n => n.pathway === activePathway);
  const unreadCount = filteredNotifs.filter(n => !n.isRead).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative inline-block cursor-pointer">
          {trigger}
          {unreadCount > 0 && (
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background" />
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3">
            Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="grow p-0">
          <ScrollArea className="h-[calc(100vh-10.5rem)]">
            <Tabs defaultValue="all" className="w-full relative">
              <TabsList variant="line" className="w-full px-5 mb-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <div className="grow flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        mode="icon"
                        className="mb-1"
                      >
                        <Settings className="size-4.5!" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44" side="bottom" align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/account/members/teams">
                          <Users /> Invite Users
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Settings2 />
                          <span>Team Settings</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-44">
                            <DropdownMenuItem asChild>
                              <Link to="/account/members/import-members">
                                <Shield />
                                Find Members
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/account/members/import-members">
                                <Calendar /> Meetings
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/account/members/import-members">
                                <Shield /> Group Settings
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem asChild>
                        <Link to="/account/security/privacy-settings">
                          <Shield /> Group Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="flex flex-col gap-5 overflow-y-auto">
                  {loading ? (
                    <div className="p-5 text-center text-muted-foreground">Loading notifications...</div>
                  ) : filteredNotifs.length === 0 ? (
                    <div className="p-5 text-center text-muted-foreground">No notifications for {activePathway} pathway.</div>
                  ) : (
                    filteredNotifs.map((notif, index) => {
                      const Component = COMPONENT_MAP[notif.uiType] || Item1;
                      return (
                        <div key={notif.id}>
                          <div className={cn("relative group", notif.isRead ? "opacity-75" : "")}>
                            <Component {...notif.payload} />
                            {!notif.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleMarkAsRead(notif.id)}
                              >
                                <Check className="size-4 mr-1 text-green-500" />
                                Mark read
                              </Button>
                            )}
                          </div>
                          {index < filteredNotifs.length - 1 && <div className="border-b border-b-border mt-5"></div>}
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="border-t border-border p-5 grid grid-cols-2 gap-2.5">
          <Button variant="outline">Archive all</Button>
          <Button variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
