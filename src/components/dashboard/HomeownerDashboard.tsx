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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  MapPin,
  Wrench,
  DollarSign,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  date: string;
  location: string;
  category: string;
  budget: string;
  applicants?: number;
  emergency?: boolean;
  tradie?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    trade: string;
  };
}

interface Message {
  id: string;
  tradieId: string;
  tradieName: string;
  tradieAvatar: string;
  jobId: string;
  jobTitle: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  image: string;
}

const mockJobs: Job[] = [
  {
    id: "job1",
    title: "Bathroom Renovation",
    description:
      "Complete renovation of main bathroom including new fixtures, tiling, and plumbing.",
    status: "in_progress",
    date: "2023-06-15",
    location: "Sydney, NSW",
    category: "Plumbing",
    budget: "$5,000 - $8,000",
    tradie: {
      id: "tradie1",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      rating: 4.8,
      trade: "Plumber",
    },
  },
  {
    id: "job2",
    title: "Garden Landscaping",
    description:
      "Redesign front garden with native plants and install irrigation system.",
    status: "open",
    date: "2023-06-20",
    location: "Brisbane, QLD",
    category: "Landscaping",
    budget: "$2,000 - $3,500",
    applicants: 3,
  },
  {
    id: "job3",
    title: "Electrical Rewiring",
    description:
      "Rewire living room and kitchen with new outlets and lighting fixtures.",
    status: "completed",
    date: "2023-05-28",
    location: "Melbourne, VIC",
    category: "Electrical",
    budget: "$1,200 - $1,800",
    tradie: {
      id: "tradie2",
      name: "Sarah Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
      trade: "Electrician",
    },
  },
  {
    id: "job4",
    title: "Emergency Roof Leak Repair",
    description:
      "Water leaking through ceiling after heavy rain. Need immediate repair.",
    status: "completed",
    date: "2023-05-10",
    location: "Sydney, NSW",
    category: "Roofing",
    budget: "$500 - $1,000",
    emergency: true,
    tradie: {
      id: "tradie3",
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      rating: 4.7,
      trade: "Roofer",
    },
  },
];

const mockMessages: Message[] = [
  {
    id: "msg1",
    tradieId: "tradie1",
    tradieName: "Mike Johnson",
    tradieAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    jobId: "job1",
    jobTitle: "Bathroom Renovation",
    lastMessage: "I'll be arriving tomorrow at 9am with the new fixtures.",
    timestamp: "2023-06-14 15:30",
    unread: true,
  },
  {
    id: "msg2",
    tradieId: "tradie4",
    tradieName: "Emma Thompson",
    tradieAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    jobId: "job2",
    jobTitle: "Garden Landscaping",
    lastMessage:
      "I've prepared a quote for your garden project. Please review and let me know your thoughts.",
    timestamp: "2023-06-13 10:15",
    unread: false,
  },
  {
    id: "msg3",
    tradieId: "tradie2",
    tradieName: "Sarah Williams",
    tradieAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    jobId: "job3",
    jobTitle: "Electrical Rewiring",
    lastMessage:
      "The job is now complete. Please let me know if you have any questions about the work done.",
    timestamp: "2023-05-29 17:45",
    unread: false,
  },
];

const mockRewards: RewardItem[] = [
  {
    id: "reward1",
    name: "$50 Home Depot Gift Card",
    description: "$50 gift card to spend at any Home Depot store",
    pointCost: 500,
    image:
      "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=300&q=80",
  },
  {
    id: "reward2",
    name: "Free Emergency Job Posting",
    description: "Post one emergency job for free (normally $25)",
    pointCost: 250,
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&q=80",
  },
  {
    id: "reward3",
    name: "Premium Job Listing",
    description:
      "Get your job featured at the top of search results for 7 days",
    pointCost: 300,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
  },
];

import { useNavigate } from "react-router-dom";

const CentraResidentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    address: "123 Main St, Sydney, NSW 2000",
    phone: "0412 345 678",
    memberSince: "May 2023",
    rewardPoints: 350,
  };

  const renderJobStatus = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* User Profile Card */}
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
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.rewardPoints} reward points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Job Summary</CardTitle>
              <CardDescription>Overview of your job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Active Jobs</p>
                  <p className="text-2xl font-bold">
                    {
                      mockJobs.filter(
                        (job) =>
                          job.status === "open" || job.status === "in_progress",
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {
                      mockJobs.filter((job) => job.status === "completed")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-600">Pending Quotes</p>
                  <p className="text-2xl font-bold">
                    {
                      mockJobs.filter(
                        (job) =>
                          job.status === "open" &&
                          job.applicants &&
                          job.applicants > 0,
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Total Jobs</p>
                  <p className="text-2xl font-bold">{mockJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full flex items-center justify-start"
                asChild
              >
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Jobs</h2>
              <Button asChild>
                <Link to="/post-job">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post New Job
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockJobs.map((job) => (
                <Card key={job.id} className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          {job.emergency && (
                            <Badge variant="destructive" className="ml-2">
                              Emergency
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{job.category}</CardDescription>
                      </div>
                      {renderJobStatus(job.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{job.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-sm">{job.location}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Date Posted
                        </p>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-sm">{job.date}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-sm">{job.budget}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {job.status === "open" ? "Applicants" : "Status"}
                        </p>
                        <div className="flex items-center">
                          {job.status === "open" ? (
                            <>
                              <Wrench className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-sm">
                                {job.applicants || 0} tradies
                              </p>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-sm">
                                {job.status === "in_progress"
                                  ? "In Progress"
                                  : job.status === "completed"
                                    ? "Completed"
                                    : "Cancelled"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {job.tradie && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          Assigned Tradie
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={job.tradie.avatar}
                                alt={job.tradie.name}
                              />
                              <AvatarFallback>
                                {job.tradie.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{job.tradie.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {job.tradie.trade}
                              </p>
                            </div>
                          </div>
                          <div>{renderStars(job.tradie.rating)}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                      {job.status === "open" && (
                        <>
                          <Button variant="outline" size="sm">
                            Edit Job
                          </Button>
                          <Button variant="outline" size="sm">
                            View Applicants ({job.applicants || 0})
                          </Button>
                        </>
                      )}
                      {job.status === "in_progress" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              (window.location.href = "/dashboard/messages")
                            }
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Tradie
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Complete
                          </Button>
                        </>
                      )}
                      {job.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`bg-white ${message.unread ? "border-primary" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={message.tradieAvatar}
                            alt={message.tradieName}
                          />
                          <AvatarFallback>
                            {message.tradieName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {message.tradieName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Re: {message.jobTitle}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{message.lastMessage}</p>
                    <div className="flex justify-end mt-4">
                      <Button
                        size="sm"
                        onClick={() =>
                          (window.location.href = "/dashboard/messages")
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Rewards</h2>
              <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center">
                <Gift className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">
                  {user.rewardPoints} points available
                </span>
              </div>
            </div>

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
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Refer a friend: 100 points</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockRewards.map((reward) => (
                <Card key={reward.id} className="bg-white">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">
                          {reward.pointCost} points
                        </span>
                      </div>
                      <Button
                        variant={
                          user.rewardPoints >= reward.pointCost
                            ? "default"
                            : "outline"
                        }
                        disabled={user.rewardPoints < reward.pointCost}
                        onClick={() => {
                          if (user.rewardPoints >= reward.pointCost) {
                            // In a real app, this would call an API to redeem the reward
                            alert(
                              `Reward ${reward.name} redeemed successfully!`,
                            );
                          }
                        }}
                      >
                        {user.rewardPoints >= reward.pointCost
                          ? "Redeem"
                          : "Not Enough Points"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CentraResidentDashboard;
