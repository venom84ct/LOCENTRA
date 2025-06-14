import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Notification {
  id: string;
  title?: string;
  description: string;
  created_at: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  related_type?: "job" | "message" | "homeowner" | "system";
  related_id?: string;
  related_name?: string;
  related_avatar?: string;
}

const HomeownerNotificationsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      const userId = authUser?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", userId)
        .single();

      if (!profile) return;
      setUser(profile);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", userId)
        .eq("recipient_type", "homeowner")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    };

    fetchUserAndNotifications();
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    await supabase.from("notifications").update({ read: true }).eq("recipient_id", user.id);
  };

  const handleView = (type: string, id: string, name?: string) => {
    if (type === "job") navigate(`/dashboard/jobs`);
    if (type === "message") navigate(`/dashboard/messages?conversationId=${id}`);
    if (type === "homeowner") navigate(`/dashboard/messages?contactId=${id}`);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {notifications.map((n) => (
                <Card key={n.id} className={`bg-white ${!n.read ? "border-primary" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-3">{getNotificationIcon(n.type)}</div>
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {n.title || "Notification"}
                            {!n.read && (
                              <Badge variant="default" className="ml-2">New</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(n.created_at).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                      {n.related_avatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={n.related_avatar} alt={n.related_name || ""} />
                          <AvatarFallback>{(n.related_name || "").substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{n.description}</p>
                    <div className="flex justify-end gap-2 flex-wrap">
                      {!n.read && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(n.id)}>
                          Mark as Read
                        </Button>
                      )}
                      {n.related_type && n.related_id && (
                        <Button
                          size="sm"
                          onClick={() => handleView(n.related_type!, n.related_id!, n.related_name)}
                        >
                          {n.related_type === "job" && <Briefcase className="h-4 w-4 mr-2" />}
                          {n.related_type === "message" && <MessageSquare className="h-4 w-4 mr-2" />}
                          {n.related_type === "homeowner" && <User className="h-4 w-4 mr-2" />}
                          View
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteNotification(n.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomeownerNotificationsPage;
