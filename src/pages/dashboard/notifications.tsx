import React, { useState } from "react";
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
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  relatedTo?: {
    type: "job" | "message" | "tradie" | "system";
    id: string;
    name?: string;
    avatar?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "notif1",
    title: "New Quote Received",
    description:
      "Mike Johnson has sent a quote for your Bathroom Renovation job.",
    timestamp: "2023-06-14 15:30",
    type: "info",
    read: false,
    relatedTo: {
      type: "tradie",
      id: "tradie1",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
  },
  {
    id: "notif2",
    title: "Job Status Updated",
    description: "Your Electrical Rewiring job has been marked as completed.",
    timestamp: "2023-06-13 10:15",
    type: "success",
    read: false,
    relatedTo: {
      type: "job",
      id: "job3",
    },
  },
  {
    id: "notif3",
    title: "Upcoming Appointment",
    description:
      "Reminder: Sarah Williams will arrive tomorrow at 9am for your Electrical Rewiring job.",
    timestamp: "2023-05-29 17:45",
    type: "warning",
    read: true,
    relatedTo: {
      type: "tradie",
      id: "tradie2",
      name: "Sarah Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  },
  {
    id: "notif4",
    title: "System Maintenance",
    description:
      "Locentra will be undergoing maintenance on June 30th from 2am to 4am.",
    timestamp: "2023-05-25 09:30",
    type: "error",
    read: true,
    relatedTo: {
      type: "system",
      id: "system1",
    },
  },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/dashboard/jobs?jobId=${jobId}`);
  };

  const handleViewMessage = (messageId: string) => {
    navigate(`/dashboard/messages?messageId=${messageId}`);
  };

  const handleViewProfile = (tradieId: string, tradieName: string) => {
    navigate(`/dashboard/find-tradie?tradieId=${tradieId}`);
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
    <DashboardLayout
      userType={
        window.location.pathname.includes("tradie")
          ? "tradie"
          : "centraResident"
      }
      user={user}
    >
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
                          {notification.timestamp}
                        </CardDescription>
                      </div>
                    </div>
                    {notification.relatedTo?.type === "tradie" &&
                      notification.relatedTo.avatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={notification.relatedTo.avatar}
                            alt={notification.relatedTo.name || ""}
                          />
                          <AvatarFallback>
                            {(notification.relatedTo.name || "").substring(
                              0,
                              2,
                            )}
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
                    {notification.relatedTo?.type === "job" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleViewJob(notification.relatedTo?.id || "")
                        }
                      >
                        View Job
                      </Button>
                    )}
                    {notification.relatedTo?.type === "message" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleViewMessage(notification.relatedTo?.id || "")
                        }
                      >
                        View Message
                      </Button>
                    )}
                    {notification.relatedTo?.type === "tradie" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleViewProfile(
                            notification.relatedTo?.id || "",
                            notification.relatedTo?.name || "",
                          )
                        }
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
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

export default NotificationsPage;
