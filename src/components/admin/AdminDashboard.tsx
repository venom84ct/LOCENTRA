import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, LogOut } from "lucide-react";
import TradieAccountManagement from "./TradieAccountManagement";
import ReviewModeration from "./ReviewModeration";
import SuspiciousActivityMonitoring from "./SuspiciousActivityMonitoring";
import RewardRedemptionApprovals from "./RewardRedemptionApprovals";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tradie-accounts");

  // Mock admin user data - in a real app, this would come from authentication
  const adminUser = {
    name: "Admin User",
    email: "admin@locentra.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    role: "admin",
    lastLogin: "2023-05-15 09:30 AM",
  };

  const handleLogout = () => {
    // In a real app, this would handle admin logout
    console.log("Admin logout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Locentra Admin
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right mr-2">
              <p className="font-medium">{adminUser.name}</p>
              <p className="text-sm text-muted-foreground">{adminUser.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={adminUser.avatar} alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Manage platform operations, users, and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Last login: {adminUser.lastLogin} • All actions are logged for
                security purposes
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="tradie-accounts">Tradie Accounts</TabsTrigger>
            <TabsTrigger value="review-moderation">
              Review Moderation
            </TabsTrigger>
            <TabsTrigger value="suspicious-activity">
              Suspicious Activity
            </TabsTrigger>
            <TabsTrigger value="reward-redemptions">
              Reward Redemptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tradie-accounts" className="space-y-4">
            <TradieAccountManagement />
          </TabsContent>

          <TabsContent value="review-moderation" className="space-y-4">
            <ReviewModeration />
          </TabsContent>

          <TabsContent value="suspicious-activity" className="space-y-4">
            <SuspiciousActivityMonitoring />
          </TabsContent>

          <TabsContent value="reward-redemptions" className="space-y-4">
            <RewardRedemptionApprovals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
