import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
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
  CreditCard,
  PlusCircle,
  Briefcase,
  Award,
  ShoppingCart,
  Eye,
  Search,
} from "lucide-react";

interface JobLead {
  id: string;
  title: string;
  description: string;
  status:
    | "available"
    | "purchased"
    | "quoted"
    | "in_progress"
    | "completed"
    | "expired";
  date: string;
  location: string;
  category: string;
  budget: string;
  emergency?: boolean;
  creditCost: number;
  centraResident?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
}

interface Message {
  id: string;
  centraResidentId: string;
  centraResidentName: string;
  centraResidentAvatar: string;
  jobId: string;
  jobTitle: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface Review {
  id: string;
  centraResidentId: string;
  centraResidentName: string;
  centraResidentAvatar: string;
  jobId: string;
  jobTitle: string;
  rating: number;
  comment: string;
  date: string;
}

const mockJobLeads: JobLead[] = [
  {
    id: "lead1",
    title: "Kitchen Sink Replacement",
    description:
      "Need to replace kitchen sink and faucet. Old sink is leaking and needs to be removed.",
    status: "available",
    date: "2023-06-15",
    location: "Sydney, NSW",
    category: "Plumbing",
    budget: "$300 - $500",
    creditCost: 5,
  },
  {
    id: "lead2",
    title: "Emergency Hot Water System Repair",
    description:
      "Hot water system not working. Need urgent repair as we have no hot water.",
    status: "available",
    date: "2023-06-14",
    location: "Sydney, NSW",
    category: "Plumbing",
    budget: "$200 - $400",
    emergency: true,
    creditCost: 10,
  },
  {
    id: "lead3",
    title: "Bathroom Renovation",
    description:
      "Complete renovation of main bathroom including new fixtures, tiling, and plumbing.",
    status: "purchased",
    date: "2023-06-10",
    location: "Sydney, NSW",
    category: "Plumbing",
    budget: "$5,000 - $8,000",
    creditCost: 5,
    centraResident: {
      id: "centraResident1",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      rating: 4.8,
    },
  },
  {
    id: "lead4",
    title: "Toilet Installation",
    description:
      "Need to install a new toilet in the main bathroom. Old toilet has been removed.",
    status: "in_progress",
    date: "2023-06-05",
    location: "Brisbane, QLD",
    category: "Plumbing",
    budget: "$400 - $600",
    creditCost: 5,
    centraResident: {
      id: "centraResident2",
      name: "Sarah Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
    },
  },
  {
    id: "lead5",
    title: "Leaking Shower Repair",
    description:
      "Shower in master bathroom is leaking. Need to identify the source and repair.",
    status: "completed",
    date: "2023-05-28",
    location: "Melbourne, VIC",
    category: "Plumbing",
    budget: "$200 - $400",
    creditCost: 5,
    centraResident: {
      id: "centraResident3",
      name: "Emma Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 4.7,
    },
  },
];

const mockMessages: Message[] = [
  {
    id: "msg1",
    centraResidentId: "centraResident1",
    centraResidentName: "John Smith",
    centraResidentAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    jobId: "lead3",
    jobTitle: "Bathroom Renovation",
    lastMessage:
      "Can you provide more details about the timeline for the renovation?",
    timestamp: "2023-06-14 15:30",
    unread: true,
  },
  {
    id: "msg2",
    centraResidentId: "centraResident2",
    centraResidentName: "Sarah Williams",
    centraResidentAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    jobId: "lead4",
    jobTitle: "Toilet Installation",
    lastMessage:
      "I'll be home all day tomorrow if you want to come by and finish the installation.",
    timestamp: "2023-06-13 10:15",
    unread: false,
  },
  {
    id: "msg3",
    centraResidentId: "centraResident3",
    centraResidentName: "Emma Johnson",
    centraResidentAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    jobId: "lead5",
    jobTitle: "Leaking Shower Repair",
    lastMessage:
      "Thank you for the great work! The shower is working perfectly now.",
    timestamp: "2023-05-29 17:45",
    unread: false,
  },
];

const mockReviews: Review[] = [
  {
    id: "review1",
    centraResidentId: "centraResident3",
    centraResidentName: "Emma Johnson",
    centraResidentAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    jobId: "lead5",
    jobTitle: "Leaking Shower Repair",
    rating: 5,
    comment:
      "Mike did an excellent job fixing our leaking shower. He was professional, on time, and cleaned up after the work was done. Highly recommend!",
    date: "2023-05-30",
  },
  {
    id: "review2",
    centraResidentId: "centraResident4",
    centraResidentName: "David Chen",
    centraResidentAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    jobId: "job-past1",
    jobTitle: "Water Heater Installation",
    rating: 4,
    comment:
      "Good work on the water heater installation. Mike was knowledgeable and efficient. Only minor issue was he arrived a bit late.",
    date: "2023-05-15",
  },
  {
    id: "review3",
    centraResidentId: "centraResident5",
    centraResidentName: "Lisa Taylor",
    centraResidentAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    jobId: "job-past2",
    jobTitle: "Bathroom Sink Repair",
    rating: 5,
    comment:
      "Fantastic service! Mike responded quickly to my emergency call and fixed the issue in no time. Fair pricing and great communication.",
    date: "2023-04-22",
  },
];

const TradieDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leads");

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    license: "PL-12345",
    abn: "12 345 678 901",
    address: "456 Tradie St, Sydney, NSW 2000",
    phone: "0412 345 678",
    memberSince: "January 2023",
    credits: 45,
    rewardPoints: 520,
    rating: 4.8,
    reviewCount: 27,
    verificationStatus: "verified",
  };

  const renderJobStatus = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary">Available</Badge>;
      case "purchased":
        return <Badge variant="default">Purchased</Badge>;
      case "quoted":
        return <Badge variant="outline">Quote Sent</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
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

  const handleMessageCentraResident = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard/tradie/messages";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Tradie Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.trade}</p>
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
              <CardDescription>Your business information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <div className="flex items-center mt-1">
                    {renderStars(user.rating)}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({user.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Wrench className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{user.trade}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-green-600 font-medium">
                    Verified Account
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Wallet */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Credit Wallet</CardTitle>
              <CardDescription>Your available lead credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold">{user.credits}</p>
                  <p className="text-sm text-muted-foreground">
                    credits available
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dashboard/wallet")}
                  type="button"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buy Credits
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Standard Job: 5 credits</span>
                    <span>Emergency Job: 10 credits</span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md text-sm">
                    <p className="font-medium">Credit Bundles</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs">50 credits: $50</div>
                      <div className="text-xs">110 credits: $100</div>
                      <div className="text-xs">240 credits: $200</div>
                      <div className="text-xs">650 credits: $500</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Job Summary</CardTitle>
              <CardDescription>Overview of your jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Active Jobs</p>
                  <p className="text-2xl font-bold">
                    {
                      mockJobLeads.filter((job) => job.status === "in_progress")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {mockJobLeads
                      ? mockJobLeads.filter((job) => job.status === "completed")
                          .length
                      : 0}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-600">Available Leads</p>
                  <p className="text-2xl font-bold">
                    {mockJobLeads
                      ? mockJobLeads.filter((job) => job.status === "available")
                          .length
                      : 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Reward Points</p>
                  <p className="text-2xl font-bold">{user.rewardPoints}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/dashboard/tradie/my-jobs")}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  View My Purchased Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="leads">Job Leads</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Job Leads</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/find-jobs")}
                  type="button"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Filter Leads
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockJobLeads
                .filter((job) => job.status === "available")
                .map((job) => (
                  <Card key={job.id} className="bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CardTitle className="text-lg">
                              {job.title}
                            </CardTitle>
                            {job.emergency && (
                              <Badge variant="destructive" className="ml-2">
                                Emergency
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{job.category}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/10">
                          {job.creditCost} credits
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{job.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                          <p className="text-xs text-muted-foreground">
                            Budget
                          </p>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p className="text-sm">{job.budget}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={user.credits < job.creditCost}
                          onClick={() => navigate("/dashboard/find-jobs")}
                          type="button"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          disabled={user.credits < job.creditCost}
                          onClick={() => navigate("/dashboard/find-jobs")}
                          type="button"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase Lead ({job.creditCost} credits)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Active Jobs</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockJobLeads
                .filter((job) =>
                  ["purchased", "quoted", "in_progress"].includes(job.status),
                )
                .map((job) => (
                  <Card key={job.id} className="bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CardTitle className="text-lg">
                              {job.title}
                            </CardTitle>
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

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                          <p className="text-xs text-muted-foreground">
                            Budget
                          </p>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p className="text-sm">{job.budget}</p>
                          </div>
                        </div>
                      </div>

                      {job.centraResident && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-xs text-muted-foreground mb-2">
                            Centra Resident
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                  src={job.centraResident.avatar}
                                  alt={job.centraResident.name}
                                />
                                <AvatarFallback>
                                  {job.centraResident.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {job.centraResident.name}
                                </p>
                              </div>
                            </div>
                            <div>
                              {job.centraResident.rating &&
                                renderStars(job.centraResident.rating)}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              `/dashboard/tradie/messages?contactId=${job.centraResident?.id}`,
                            );
                          }}
                          type="button"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        {job.status === "purchased" && (
                          <Button size="sm" type="button">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Send Quote
                          </Button>
                        )}
                        {job.status === "quoted" && (
                          <Button variant="outline" size="sm" type="button">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Centra Resident
                          </Button>
                        )}
                        {job.status === "in_progress" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleMessageCentraResident}
                              type="button"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Centra Resident
                            </Button>
                            <Button size="sm" type="button">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {mockJobLeads.filter((job) =>
                ["purchased", "quoted", "in_progress"].includes(job.status),
              ).length === 0 && (
                <Card className="bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Active Jobs</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      You don't have any active jobs at the moment. Purchase
                      leads to start working on new projects.
                    </p>
                    <Button onClick={() => setActiveTab("leads")} type="button">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Browse Available Leads
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                            src={message.centraResidentAvatar}
                            alt={message.centraResidentName}
                          />
                          <AvatarFallback>
                            {message.centraResidentName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {message.centraResidentName}
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
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(
                            `/dashboard/tradie/messages?contactId=${message.centraResidentId}`,
                          );
                        }}
                        type="button"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockMessages.length === 0 && (
                <Card className="bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Messages</h3>
                    <p className="text-muted-foreground text-center">
                      You don't have any messages yet. Messages from Centra
                      Residents will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">
                  {user.rating} ({user.reviewCount} reviews)
                </span>
              </div>
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">5</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-sm">18 reviews</span>
                    </div>
                    <Progress value={67} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">4</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-sm">7 reviews</span>
                    </div>
                    <Progress value={26} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">3</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-sm">2 reviews</span>
                    </div>
                    <Progress value={7} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">2</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-sm">0 reviews</span>
                    </div>
                    <Progress value={0} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">1</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-sm">0 reviews</span>
                    </div>
                    <Progress value={0} className="h-2 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {mockReviews.map((review) => (
                <Card key={review.id} className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={review.centraResidentAvatar}
                            alt={review.centraResidentName}
                          />
                          <AvatarFallback>
                            {review.centraResidentName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {review.centraResidentName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {review.jobTitle}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.date}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    <p className="text-sm">"{review.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Job Portfolio</h2>
              <Button type="button">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.previousJobs &&
                user.previousJobs.map((job) => (
                  <Card key={job.id} className="bg-white overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={job.image}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" type="button">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tradie of the Week</h2>
              <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                <span className="font-medium">Week 23, 2023</span>
              </div>
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Top Performing Tradies</CardTitle>
                <CardDescription>
                  Based on ratings, completed jobs, and customer satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* First Place */}
                  <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <div className="bg-yellow-500 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center mr-4">
                        1
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
                          alt="Mike Johnson"
                        />
                        <AvatarFallback>MJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Mike Johnson</p>
                        <p className="text-sm text-muted-foreground">Plumber</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {renderStars(4.9)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        12 jobs completed
                      </p>
                    </div>
                  </div>

                  {/* Second Place */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="bg-gray-400 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center mr-4">
                        2
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                          alt="Sarah Williams"
                        />
                        <AvatarFallback>SW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah Williams</p>
                        <p className="text-sm text-muted-foreground">
                          Electrician
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {renderStars(4.8)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        10 jobs completed
                      </p>
                    </div>
                  </div>

                  {/* Third Place */}
                  <div className="flex items-center justify-between bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center">
                      <div className="bg-amber-700 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center mr-4">
                        3
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=David"
                          alt="David Chen"
                        />
                        <AvatarFallback>DC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">David Chen</p>
                        <p className="text-sm text-muted-foreground">Roofer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {renderStars(4.7)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        8 jobs completed
                      </p>
                    </div>
                  </div>

                  {/* Fourth Place */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="bg-gray-300 text-gray-700 font-bold h-8 w-8 rounded-full flex items-center justify-center mr-4">
                        4
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
                          alt="Emma Thompson"
                        />
                        <AvatarFallback>ET</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Emma Thompson</p>
                        <p className="text-sm text-muted-foreground">
                          Landscaper
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {renderStars(4.6)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        7 jobs completed
                      </p>
                    </div>
                  </div>

                  {/* Fifth Place */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="bg-gray-300 text-gray-700 font-bold h-8 w-8 rounded-full flex items-center justify-center mr-4">
                        5
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=James"
                          alt="James Wilson"
                        />
                        <AvatarFallback>JW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">James Wilson</p>
                        <p className="text-sm text-muted-foreground">
                          Carpenter
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {renderStars(4.5)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        6 jobs completed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradieDashboard;
