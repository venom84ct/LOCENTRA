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
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/");
  };

  const navItems =
    userType === "centraResident"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Jobs", path: "/dashboard/jobs", icon: Briefcase },
          {
            name: "Messages",
            path: "/dashboard/messages",
            icon: MessagesSquare,
            badgeKey: "messages",
          },
          {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: Bell,
            badgeKey: "notifications",
          },
          { name: "Rewards", path: "/dashboard/rewards", icon: Gift },
          { name: "Help", path: "/dashboard/help", icon: HelpCircle },
          { name: "Settings", path: "/dashboard/settings", icon: Settings },
          {
            name: "Logout",
            path: "/",
            icon: LogOut,
            onClick: handleLogout,
          },
        ]
      : [
          { name: "Dashboard", path: "/dashboard/tradie", icon: LayoutDashboard },
          { name: "Find Jobs", path: "/dashboard/tradie/find-jobs", icon: Search },
          {
            name: "Messages",
            path: "/dashboard/tradie/messages",
            icon: MessagesSquare,
            badgeKey: "messages",
          },
          {
            name: "Notifications",
            path: "/dashboard/tradie/notifications",
            icon: Bell,
            badgeKey: "notifications",
          },
          { name: "Top Tradies", path: "/dashboard/tradie/top-tradies", icon: Award },
          { name: "Settings", path: "/dashboard/tradie/settings", icon: Settings },
          {
            name: "Logout",
            path: "/",
            icon: LogOut,
            onClick: handleLogout,
          },
        ];

  // Fetch unread counts once
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const { count: msgCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);

      const { count: notifCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setUnreadMessages(msgCount || 0);
      setUnreadNotifications(notifCount || 0);
    };

    fetchUnreadCounts();
  }, [user.id]);

  // Real-time updates
  useEffect(() => {
    const msgChannel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          setUnreadMessages((prev) => prev + 1);
        }
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
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnreadNotifications((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [user.id]);

  const getBadgeCount = (badgeKey: string) => {
    if (badgeKey === "messages") return unreadMessages;
    if (badgeKey === "notifications") return unreadNotifications;
    return 0;
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const badgeCount = item.badgeKey ? getBadgeCount(item.badgeKey) : 0;

          return (
            <div key={item.name}>
              <Link
                to={item.path}
                onClick={item.onClick}
                className={cn(
                  "flex items-center justify-between px-4 py-2 rounded-md hover:bg-muted",
                  isActive && "bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
                {badgeCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {badgeCount}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </aside>

      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
