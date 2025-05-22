import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  MessageSquare,
  Calendar,
  CheckCircle,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  Search,
  ArchiveX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobLead {
  id: string;
  title: string;
  description: string;
  status: "purchased" | "quoted" | "in_progress" | "completed" | "archived";
  date: string;
  location: string;
  category: string;
  budget: string;
  emergency?: boolean;
  creditCost: number;
  homeowner?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    memberSince?: string;
    messageStatus?: "pending" | "accepted" | "archived";
  };
  purchaseDate?: string;
}

const MyJobsPage = () => {
  const location = useLocation();
  const jobId = new URLSearchParams(location.search).get("jobId");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      console.log(`Opening job with ID: ${jobId}`);
      // In a real app, this would load the specific job details
      // For now, we could filter to show only this job
      setSearchTerm(jobId);
    }
  }, [jobId]);

  // Mock user data
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    credits: 45,
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  // Mock purchased jobs data
  const [purchasedJobs, setPurchasedJobs] = useState<JobLead[]>([
    {
      id: "lead1",
      title: "Kitchen Sink Replacement",
      description:
        "Need to replace kitchen sink and faucet. Old sink is leaking and needs to be removed.",
      status: "purchased",
      date: "2023-06-15",
      location: "Sydney, NSW",
      category: "Plumbing",
      budget: "$300 - $500",
      creditCost: 5,
      purchaseDate: "2023-06-16",
      homeowner: {
        id: "homeowner1",
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        rating: 4.8,
        memberSince: "January 2023",
        messageStatus: "pending",
      },
    },
    {
      id: "lead2",
      title: "Emergency Hot Water System Repair",
      description:
        "Hot water system not working. Need urgent repair as we have no hot water.",
      status: "in_progress",
      date: "2023-06-14",
      location: "Sydney, NSW",
      category: "Plumbing",
      budget: "$200 - $400",
      emergency: true,
      creditCost: 10,
      purchaseDate: "2023-06-15",
      homeowner: {
        id: "homeowner2",
        name: "Sarah Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 4.9,
        memberSince: "March 2023",
        messageStatus: "accepted",
      },
    },
    {
      id: "lead3",
      title: "Bathroom Renovation",
      description:
        "Complete renovation of main bathroom including new fixtures, tiling, and plumbing.",
      status: "quoted",
      date: "2023-06-10",
      location: "Sydney, NSW",
      category: "Plumbing",
      budget: "$5,000 - $8,000",
      creditCost: 5,
      purchaseDate: "2023-06-12",
      homeowner: {
        id: "homeowner3",
        name: "Emma Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        rating: 4.7,
        memberSince: "February 2023",
        messageStatus: "accepted",
      },
    },
    {
      id: "lead4",
      title: "Toilet Installation",
      description:
        "Need to install a new toilet in the main bathroom. Old toilet has been removed.",
      status: "archived",
      date: "2023-06-05",
      location: "Brisbane, QLD",
      category: "Plumbing",
      budget: "$400 - $600",
      creditCost: 5,
      purchaseDate: "2023-06-07",
      homeowner: {
        id: "homeowner4",
        name: "David Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        rating: 4.5,
        memberSince: "April 2023",
        messageStatus: "archived",
      },
    },
  ]);

  const renderJobStatus = (status: string) => {
    switch (status) {
      case "purchased":
        return <Badge variant="default">Purchased</Badge>;
      case "quoted":
        return <Badge variant="outline">Quote Sent</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "archived":
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return null;
    }
  };

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Response</Badge>;
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "archived":
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Filter jobs based on search term and status
  const filteredJobs = purchasedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? job.status === statusFilter : true;

    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "active"
          ? ["purchased", "quoted", "in_progress"].includes(job.status)
          : activeTab === "archived"
            ? job.status === "archived"
            : true;

    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleContactHomeowner = (jobId: string) => {
    window.location.href = `/dashboard/tradie/messages?jobId=${jobId}`;
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard/find-jobs")}
            >
              <Search className="mr-2 h-4 w-4" />
              Find More Jobs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="md:col-span-1">
            <Card className="bg-white sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search jobs..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Status</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={statusFilter === null ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setStatusFilter(null)}
                    >
                      All
                    </Badge>
                    <Badge
                      variant={
                        statusFilter === "purchased" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("purchased")}
                    >
                      Purchased
                    </Badge>
                    <Badge
                      variant={
                        statusFilter === "quoted" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("quoted")}
                    >
                      Quoted
                    </Badge>
                    <Badge
                      variant={
                        statusFilter === "in_progress" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("in_progress")}
                    >
                      In Progress
                    </Badge>
                    <Badge
                      variant={
                        statusFilter === "completed" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("completed")}
                    >
                      Completed
                    </Badge>
                    <Badge
                      variant={
                        statusFilter === "archived" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("archived")}
                    >
                      Archived
                    </Badge>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onContact={handleContactHomeowner}
                    />
                  ))
                ) : (
                  <EmptyState
                    message="No jobs found matching your filters"
                    description="Try adjusting your search or filters to see more results."
                  />
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onContact={handleContactHomeowner}
                    />
                  ))
                ) : (
                  <EmptyState
                    message="No active jobs found"
                    description="Purchase leads to start working on new projects."
                  />
                )}
              </TabsContent>

              <TabsContent value="archived" className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onContact={handleContactHomeowner}
                    />
                  ))
                ) : (
                  <EmptyState
                    message="No archived jobs found"
                    description="Archived jobs will appear here."
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface JobCardProps {
  job: JobLead;
  onContact: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onContact }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderJobStatus = (status: string) => {
    switch (status) {
      case "purchased":
        return <Badge variant="default">Purchased</Badge>;
      case "quoted":
        return <Badge variant="outline">Quote Sent</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "archived":
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return null;
    }
  };

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Response</Badge>;
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "archived":
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
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
          <div className="flex flex-col items-end gap-1">
            {renderJobStatus(job.status)}
            {job.homeowner?.messageStatus &&
              renderMessageStatus(job.homeowner.messageStatus)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{job.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
              <p className="text-sm">{job.location}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date Posted</p>
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
        </div>

        {job.homeowner && (
          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              Centra Resident
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={job.homeowner.avatar}
                    alt={job.homeowner.name}
                  />
                  <AvatarFallback>
                    {job.homeowner.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{job.homeowner.name}</p>
                  {job.homeowner.memberSince && (
                    <p className="text-xs text-muted-foreground">
                      Member since {job.homeowner.memberSince}
                    </p>
                  )}
                </div>
              </div>
              <div>
                {job.homeowner.rating && renderStars(job.homeowner.rating)}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          {job.status !== "archived" && (
            <Button
              onClick={() => onContact(job.id)}
              disabled={job.homeowner?.messageStatus === "archived"}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {job.homeowner?.messageStatus === "pending"
                ? "Awaiting Response"
                : "Contact Resident"}
            </Button>
          )}
          {job.status === "archived" && (
            <Button variant="outline" disabled>
              <ArchiveX className="h-4 w-4 mr-2" />
              Archived
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EmptyStateProps {
  message: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, description }) => {
  return (
    <Card className="bg-white">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground text-center mb-4">{description}</p>
        <Button onClick={() => (window.location.href = "/dashboard/find-jobs")}>
          Find New Jobs
        </Button>
      </CardContent>
    </Card>
  );
};

export default MyJobsPage;
