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
  Briefcase,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  relatedTo?: {
    type: "job" | "message" | "homeowner" | "system";
    id: string;
    name?: string;
    avatar?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "notif1",
    title: "New Job Lead Available",
    description: "A new plumbing job has been posted in your area.",
    timestamp: "2023-06-14 15:30",
    type: "info",
    read: false,
    relatedTo: {
      type: "job",
      id: "job1",
    },
  },
  {
    id: "notif2",
    title: "Quote Accepted",
    description:
      "John Smith has accepted your quote for the Bathroom Renovation job.",
    timestamp: "2023-06-13 10:15",
    type: "success",
    read: false,
    relatedTo: {
      type: "homeowner",
      id: "homeowner1",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
  },
  {
    id: "notif3",
    title: "New Message",
    description:
      "You have a new message from Sarah Williams regarding the Toilet Installation job.",
    timestamp: "2023-05-29 17:45",
    type: "info",
    read: true,
    relatedTo: {
      type: "message",
      id: "msg2",
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
    type: "warning",
    read: true,
    relatedTo: {
      type: "system",
      id: "system1",
    },
  },
];

const TradieNotificationsPage = () => {
  const navigate = useNavigate();
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    unreadMessages: 1,
    unreadNotifications: 2,
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
    navigate(`/dashboard/tradie/my-jobs?jobId=${jobId}`);
  };

  const handleViewMessage = (messageId: string) => {
    navigate(`/dashboard/tradie/messages?messageId=${messageId}`);
  };

  const handleViewProfile = (homeownerId: string, homeownerName: string) => {
    // In a real app, this would navigate to a homeowner profile page
    // For now, we'll just go to messages with a query param
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
    <DashboardLayout userType="tradie" user={user}>
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
                    {notification.relatedTo?.type === "homeowner" &&
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
                        <Briefcase className="h-4 w-4 mr-2" />
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
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Message
                      </Button>
                    )}
                    {notification.relatedTo?.type === "homeowner" && (
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

export default TradieNotificationsPage;
