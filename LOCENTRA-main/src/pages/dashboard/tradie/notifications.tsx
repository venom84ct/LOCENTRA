import React, { useEffect, useState } from "react";
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
  title: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  related_type?: "job" | "message" | "homeowner" | "system";
  related_id?: string;
  avatar_url?: string;
  name?: string;
}

const TradieNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false });

      if (!error && data) setNotifications(data);
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/dashboard/tradie/my-jobs?jobId=${jobId}`);
  };

  const handleViewMessage = (messageId: string) => {
    navigate(`/dashboard/tradie/messages?messageId=${messageId}`);
  };

  const handleViewProfile = (homeownerId: string) => {
    navigate(`/dashboard/tradie/messages?contactId=${homeownerId}`);
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
    <DashboardLayout userType="tradie">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-white ${!notification.read ? "border-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center">
                          {notification.title}
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">
                              New
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(notification.timestamp).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    {notification.avatar_url && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.avatar_url} alt={notification.name || ""} />
                        <AvatarFallback>
                          {(notification.name || "").substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{notification.description}</p>
                  <div className="flex justify-end mt-4 space-x-2">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    {notification.related_type === "job" && (
                      <Button size="sm" onClick={() => handleViewJob(notification.related_id || "")}> <Briefcase className="h-4 w-4 mr-2" /> View Job </Button>
                    )}
                    {notification.related_type === "message" && (
                      <Button size="sm" onClick={() => handleViewMessage(notification.related_id || "")}> <MessageSquare className="h-4 w-4 mr-2" /> View Message </Button>
                    )}
                    {notification.related_type === "homeowner" && (
                      <Button size="sm" onClick={() => handleViewProfile(notification.related_id || "")}> <User className="h-4 w-4 mr-2" /> View Profile </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradieNotificationsPage;

