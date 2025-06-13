import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  MessagesSquare,
  Bell,
  Settings,
  HelpCircle,
  Gift,
  User,
  Award,
  Search,
  LogOut,
  Menu,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

interface DashboardLayoutProps {
  userType: "centraResident" | "tradie";
  user: any;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userType,
  user,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMessagePage =
    (userType === "centraResident" && location.pathname === "/dashboard/messages") ||
    (userType === "tradie" && location.pathname === "/dashboard/tradie/messages");

  const isNotificationPage =
    (userType === "centraResident" && location.pathname === "/dashboard/notifications") ||
    (userType === "tradie" && location.pathname === "/dashboard/tradie/notifications");

  const fetchUnreadCounts = async () => {
    if (!user?.id) return;
    const msgField = userType === "centraResident" ? "homeowner_id" : "tradie_id";

    const { count: msgCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq(msgField, user.id)
      .eq("is_read", false);

    const { count: notifCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("recipient_type", userType === "centraResident" ? "homeowner" : "tradie")
      .eq("read", false);

    if (isMessagePage) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq(msgField, user.id)
        .eq("is_read", false);
      setUnreadMessages(0);
    } else {
      setUnreadMessages(msgCount || 0);
    }

    if (isNotificationPage) {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("recipient_id", user.id)
        .eq("recipient_type", userType === "centraResident" ? "homeowner" : "tradie")
        .eq("read", false);
      setUnreadNotifications(0);
    } else {
      setUnreadNotifications(notifCount || 0);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();
  }, [user?.id, userType, location.pathname]);

  useEffect(() => {
    if (!user?.id) return;
    const msgField = userType === "centraResident" ? "homeowner_id" : "tradie_id";

    const msgChannel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `${msgField}=eq.${user.id}`,
        },
        fetchUnreadCounts
      )
      .subscribe();

    const notifChannel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        fetchUnreadCounts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [user?.id, userType]);

  const navItems =
    userType === "centraResident"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Jobs", path: "/dashboard/jobs", icon: Briefcase },
          { name: "Post a Job", path: "/dashboard/post-job", icon: Briefcase },
          { name: "Job History", path: "/dashboard/job-history", icon: Briefcase },
          {
            name: "Messages",
            path: "/dashboard/messages",
            icon: MessagesSquare,
            badgeCount: unreadMessages,
          },
          {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: Bell,
            badgeCount: unreadNotifications,
          },
          { name: "Rewards", path: "/dashboard/rewards", icon: Gift },
          { name: "Profile", path: "/dashboard/profile", icon: User },
          { name: "Settings", path: "/dashboard/settings", icon: Settings },
          { name: "Help", path: "/dashboard/help", icon: HelpCircle },
        ]
      : [
          { name: "Dashboard", path: "/dashboard/tradie", icon: LayoutDashboard },
          { name: "Find Jobs", path: "/dashboard/tradie/find-jobs", icon: Search },
          { name: "My Jobs", path: "/dashboard/tradie/my-jobs", icon: Briefcase },
          {
            name: "Messages",
            path: "/dashboard/tradie/messages",
            icon: MessagesSquare,
            badgeCount: unreadMessages,
          },
          {
            name: "Notifications",
            path: "/dashboard/tradie/notifications",
            icon: Bell,
            badgeCount: unreadNotifications,
          },
          { name: "Top Tradies", path: "/dashboard/tradie/top-tradies", icon: Award },
          { name: "Profile", path: "/dashboard/tradie/profile", icon: User },
          { name: "Settings", path: "/dashboard/tradie/settings", icon: Settings },
          { name: "Help", path: "/dashboard/tradie/help", icon: HelpCircle },
        ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/");
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
          <div className="mb-6">
            <div className="text-lg font-bold">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link to={item.path} key={item.name}>
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 rounded hover:bg-gray-100 transition-colors",
                      isActive ? "bg-gray-200 font-semibold" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </div>
                    {item.badgeCount && item.badgeCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badgeCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center p-2 mt-4 text-red-600 hover:bg-red-50 rounded w-full transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between p-4 bg-white shadow md:hidden">
            <DrawerTrigger asChild>
              <button className="p-2" onClick={() => setDrawerOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
            </DrawerTrigger>
            <span className="font-semibold">Dashboard</span>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>

      <DrawerContent>
        <div className="p-4">
          <div className="mb-6 md:hidden">
            <div className="text-lg font-bold">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <DrawerClose asChild key={item.name}>
                  <Link to={item.path} onClick={() => setDrawerOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center justify-between p-2 rounded hover:bg-gray-100 transition-colors",
                        isActive ? "bg-gray-200 font-semibold" : ""
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </div>
                      {item.badgeCount && item.badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badgeCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </DrawerClose>
              );
            })}
            <DrawerClose asChild>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
                className="flex items-center p-2 mt-4 text-red-600 hover:bg-red-50 rounded w-full transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </DrawerClose>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardLayout;
