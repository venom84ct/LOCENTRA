import React, { useState } from "react";
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
  AlertTriangle,
  CheckCircle,
  Shield,
  Smartphone,
  Globe,
} from "lucide-react";

type ActivityType =
  | "self_purchase"
  | "multiple_accounts"
  | "review_abuse"
  | "login_attempt";
type SeverityLevel = "high" | "medium" | "low";

interface SuspiciousActivity {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  userName: string;
  userAvatar: string;
  deviceId?: string;
  ipAddress?: string;
  severity: SeverityLevel;
  detectedDate: string;
  status: "active" | "resolved";
  details: string;
}

const mockSuspiciousActivities: SuspiciousActivity[] = [
  {
    id: "1",
    type: "self_purchase",
    description: "User purchased their own job lead",
    userId: "user1",
    userName: "Mike Johnson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    deviceId: "device123",
    ipAddress: "192.168.1.1",
    severity: "high",
    detectedDate: "2023-05-15",
    status: "active",
    details:
      "User created a job posting as a homeowner and then purchased the lead as a tradie using a different account but same device and IP address.",
  },
  {
    id: "2",
    type: "multiple_accounts",
    description: "Multiple accounts from same device",
    userId: "user2",
    userName: "Sarah Williams",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    deviceId: "device456",
    ipAddress: "192.168.1.2",
    severity: "medium",
    detectedDate: "2023-05-14",
    status: "active",
    details:
      "User created 3 different tradie accounts from the same device within 24 hours. All accounts have different names but similar email patterns.",
  },
  {
    id: "3",
    type: "review_abuse",
    description: "Review abuse pattern detected",
    userId: "user3",
    userName: "David Chen",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    severity: "medium",
    detectedDate: "2023-05-13",
    status: "active",
    details:
      "User has left negative reviews for 5 different tradies in the same trade category within 48 hours. All reviews have similar wording patterns.",
  },
  {
    id: "4",
    type: "login_attempt",
    description: "Suspicious login attempts",
    userId: "user4",
    userName: "Emma Johnson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    deviceId: "device789",
    ipAddress: "192.168.1.4",
    severity: "high",
    detectedDate: "2023-05-12",
    status: "resolved",
    details:
      "Multiple failed login attempts from different countries within a short time period. Account has been temporarily locked and user notified.",
  },
];

const SuspiciousActivityMonitoring = () => {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");
  const [severityFilter, setSeverityFilter] = useState<"all" | SeverityLevel>(
    "all",
  );

  const filteredActivities = mockSuspiciousActivities
    .filter((activity) => filter === "all" || activity.status === filter)
    .filter(
      (activity) =>
        severityFilter === "all" || activity.severity === severityFilter,
    );

  const handleMarkAsResolved = (activityId: string) => {
    // In a real app, this would update the activity status in the database
    console.log(`Marking activity ${activityId} as resolved`);
  };

  const handleReactivate = (activityId: string) => {
    // In a real app, this would update the activity status in the database
    console.log(`Reactivating activity ${activityId}`);
  };

  const getActivityTypeIcon = (type: ActivityType) => {
    switch (type) {
      case "self_purchase":
        return <Shield className="h-5 w-5 text-blue-500" />;
      case "multiple_accounts":
        return <Smartphone className="h-5 w-5 text-purple-500" />;
      case "review_abuse":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "login_attempt":
        return <Globe className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suspicious Activity Monitoring</h2>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <Button
              variant={severityFilter === "all" ? "default" : "outline"}
              onClick={() => setSeverityFilter("all")}
              size="sm"
            >
              All Severity
            </Button>
            <Button
              variant={severityFilter === "high" ? "default" : "outline"}
              onClick={() => setSeverityFilter("high")}
              size="sm"
            >
              High
            </Button>
            <Button
              variant={severityFilter === "medium" ? "default" : "outline"}
              onClick={() => setSeverityFilter("medium")}
              size="sm"
            >
              Medium
            </Button>
            <Button
              variant={severityFilter === "low" ? "default" : "outline"}
              onClick={() => setSeverityFilter("low")}
              size="sm"
            >
              Low
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              All Status
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filter === "resolved" ? "default" : "outline"}
              onClick={() => setFilter("resolved")}
              size="sm"
            >
              Resolved
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getActivityTypeIcon(activity.type)}
                  <div className="ml-2">
                    <CardTitle className="text-lg">
                      {activity.description}
                    </CardTitle>
                    <CardDescription>
                      Detected on {activity.detectedDate}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getSeverityBadge(activity.severity)}
                  <Badge
                    variant={
                      activity.status === "active" ? "secondary" : "outline"
                    }
                  >
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 mb-4 bg-gray-50">
                <p className="text-gray-700">{activity.details}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground mb-1">User</p>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={activity.userAvatar}
                        alt={activity.userName}
                      />
                      <AvatarFallback>
                        {activity.userName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p>{activity.userName}</p>
                  </div>
                </div>
                {activity.deviceId && (
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      Device ID
                    </p>
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm font-mono">{activity.deviceId}</p>
                    </div>
                  </div>
                )}
                {activity.ipAddress && (
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      IP Address
                    </p>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm font-mono">{activity.ipAddress}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                {activity.status === "active" ? (
                  <Button onClick={() => handleMarkAsResolved(activity.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleReactivate(activity.id)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Reactivate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuspiciousActivityMonitoring;
