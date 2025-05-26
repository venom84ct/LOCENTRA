import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyJobsSection from "@/components/dashboard/MyJobsSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  MessageSquare,
  Gift,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CentraResidentDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");

  // Static mock user
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    address: "123 Main St, Sydney, NSW 2000",
    phone: "0412 345 678",
    memberSince: "May 2023",
    rewardPoints: 350,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            Centra Resident Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {user.memberSince}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Gift className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.rewardPoints} reward points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full flex items-center justify-start" asChild>
                <Link to="/post-job">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a New Job
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-start"
                onClick={() => (window.location.href = "/dashboard/messages")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-start"
                onClick={() => (window.location.href = "/dashboard/rewards")}
              >
                <Gift className="mr-2 h-4 w-4" />
                Redeem Rewards
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <MyJobsSection />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <p className="text-muted-foreground text-sm">Message view coming soon.</p>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>How to Earn Points</CardTitle>
                <CardDescription>
                  Earn rewards by using the Locentra platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Post a job: 10 points</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Complete a job: 50 points</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Leave a review: 25 points</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CentraResidentDashboard;
