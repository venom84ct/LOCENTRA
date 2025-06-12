import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Bell, Mail, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  userType: "homeowner" | "tradie";
  user?: any;
  children: React.ReactNode;
}

const DashboardLayout = ({ userType, user, children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchProfileAndCounts = async () => {
      if (!user) return;

      const table = userType === "tradie" ? "profile_centra_tradie" : "profile_centra_resident";

      const { data: profileData } = await supabase
        .from(table)
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: unreadMsgs } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("read", false);

      setUnreadMessages(unreadMsgs?.length || 0);

      const { data: unreadNotifs } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("read", false);

      setUnreadNotifications(unreadNotifs?.length || 0);
    };

    fetchProfileAndCounts();
  }, [user, userType]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow border-r px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.svg" alt="Locentra" className="h-8 w-auto" />
          <span className="font-bold text-lg">Locentra</span>
        </div>
        <nav className="space-y-3">
          <Link to="/dashboard" className="block">Dashboard</Link>
          <Link to="/dashboard/messages" className="flex items-center justify-between">
            Messages
            {unreadMessages > 0 && (
              <Badge variant="destructive">{unreadMessages}</Badge>
            )}
          </Link>
          <Link to="/dashboard/notifications" className="flex items-center justify-between">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="default">{unreadNotifications}</Badge>
            )}
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 mt-6 text-sm text-red-600">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
          <div>
            <h1 className="text-lg font-semibold capitalize">{userType} Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {profile && (
              <Avatar>
                <AvatarImage src={profile.avatar_url || `https://robohash.org/${user.id}`} />
                <AvatarFallback>
                  {(profile.full_name || "U").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
