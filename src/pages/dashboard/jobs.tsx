import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLocation } from "react-router-dom";
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
  Star,
  Calendar,
  MapPin,
  Wrench,
  DollarSign,
} from "lucide-react";

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

const JobsPage = () => {
  const location = useLocation();
  const jobId = new URLSearchParams(location.search).get("jobId");
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  useEffect(() => {
    if (jobId) {
      // Find the job in our list
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        setHighlightedJobId(jobId);
        // In a real app, you might want to scroll to this job
        setTimeout(() => {
          const element = document.getElementById(`job-${jobId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [jobId, jobs]);

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

  const handleMessageTradie = (tradieId: string) => {
    // Navigate to messages with this tradie
    window.location.href = `/dashboard/messages?contactId=${tradieId}`;
  };

  const handleMarkComplete = (jobId: string) => {
    // Update the job status to completed
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, status: "completed" } : job,
      ),
    );
  };

  const handleLeaveReview = (tradieId: string) => {
    // In a real app, this would open a review dialog or navigate to a review page
    console.log(`Opening review form for tradie: ${tradieId}`);
  };

  return (
    <DashboardLayout userType="homeowner" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Jobs</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                id={`job-${job.id}`}
                className={`bg-white ${highlightedJobId === job.id ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
              >
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
                      <p className="text-xs text-muted-foreground">Location</p>
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
                            job.tradie && handleMessageTradie(job.tradie.id)
                          }
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Tradie
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkComplete(job.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      </>
                    )}
                    {job.status === "completed" && job.tradie && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveReview(job.tradie?.id || "")}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Leave Review
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

export default JobsPage;
