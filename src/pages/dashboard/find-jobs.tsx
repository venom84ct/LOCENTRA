import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  CreditCard,
  AlertCircle,
  Eye,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PurchaseLeadModal from "@/components/dashboard/PurchaseLeadModal";
import JobPreviewModal from "@/components/dashboard/JobPreviewModal";
import BuyCreditsModal from "@/components/wallet/BuyCreditsModal";

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
  homeowner?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
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
    status: "available",
    date: "2023-06-10",
    location: "Sydney, NSW",
    category: "Plumbing",
    budget: "$5,000 - $8,000",
    creditCost: 5,
  },
  {
    id: "lead4",
    title: "Toilet Installation",
    description:
      "Need to install a new toilet in the main bathroom. Old toilet has been removed.",
    status: "available",
    date: "2023-06-05",
    location: "Brisbane, QLD",
    category: "Plumbing",
    budget: "$400 - $600",
    creditCost: 5,
  },
  {
    id: "lead5",
    title: "Leaking Shower Repair",
    description:
      "Shower in master bathroom is leaking. Need to identify the source and repair.",
    status: "available",
    date: "2023-05-28",
    location: "Melbourne, VIC",
    category: "Plumbing",
    budget: "$200 - $400",
    creditCost: 5,
  },
  {
    id: "lead6",
    title: "Electrical Rewiring",
    description:
      "Need complete rewiring for a 3-bedroom house. Current wiring is outdated.",
    status: "available",
    date: "2023-06-12",
    location: "Perth, WA",
    category: "Electrical",
    budget: "$3,000 - $5,000",
    creditCost: 5,
  },
  {
    id: "lead7",
    title: "Emergency Power Outage",
    description:
      "Half the house has no power. Need urgent assistance to restore electricity.",
    status: "available",
    date: "2023-06-13",
    location: "Adelaide, SA",
    category: "Electrical",
    budget: "$200 - $400",
    emergency: true,
    creditCost: 10,
  },
];

const FindJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobLead | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobLead[]>(mockJobLeads);

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    credits: 45,
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? job.category === selectedCategory
      : true;
    const matchesEmergency = showEmergencyOnly ? job.emergency === true : true;

    return matchesSearch && matchesCategory && matchesEmergency;
  });

  const categories = Array.from(new Set(jobs.map((job) => job.category)));

  const handlePreviewJob = (job: JobLead) => {
    setSelectedJob(job);
    setIsPreviewModalOpen(true);
  };

  const handlePurchaseClick = (job: JobLead) => {
    setSelectedJob(job);
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseLead = () => {
    if (!selectedJob) return;

    const leadCost = selectedJob.emergency ? 10 : 5;

    if (user.credits >= leadCost) {
      // Update the job to be purchased
      setJobs(
        jobs.map((job) =>
          job.id === selectedJob.id
            ? {
                ...job,
                status: "purchased",
                homeowner: {
                  id: "homeowner1",
                  name: "John Smith",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
                  rating: 4.8,
                },
              }
            : job,
        ),
      );

      // Close modal
      setIsPurchaseModalOpen(false);
      setIsPreviewModalOpen(false);

      // Show success message
      toast({
        title: "Lead Purchased Successfully",
        description: `You have purchased the lead for ${selectedJob.title}. You can now contact the homeowner.`,
      });

      // Navigate to my jobs page after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard/tradie/my-jobs";
      }, 1500);
    } else {
      // Not enough credits
      setIsPurchaseModalOpen(false);
      setIsBuyCreditsModalOpen(true);
    }
  };

  const handleBuyCredits = (amount: number, cost: number) => {
    // In a real app, this would process payment
    setIsBuyCreditsModalOpen(false);

    toast({
      title: "Credits Purchased",
      description: `You have successfully purchased ${amount} credits for $${cost}.`,
    });
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Find Jobs</h1>
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {user.credits} credits available
              </span>
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
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          selectedCategory === null ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      >
                        All
                      </Badge>
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emergency-only"
                      checked={showEmergencyOnly}
                      onChange={() => setShowEmergencyOnly(!showEmergencyOnly)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="emergency-only"
                      className="text-sm font-medium"
                    >
                      Emergency jobs only
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory(null);
                        setShowEmergencyOnly(false);
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
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
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
                            onClick={() => handlePreviewJob(job)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          {job.status === "available" ? (
                            <Button
                              size="sm"
                              disabled={user.credits < job.creditCost}
                              onClick={() => handlePurchaseClick(job)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Purchase Lead ({job.creditCost} credits)
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                (window.location.href =
                                  "/dashboard/tradie/messages")
                              }
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Centra Resident
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-white">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No jobs found
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        We couldn't find any jobs matching your search criteria.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory(null);
                          setShowEmergencyOnly(false);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PurchaseLeadModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        job={selectedJob}
        onPurchase={handlePurchaseLead}
        availableCredits={user.credits}
      />

      <JobPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        job={selectedJob}
        onPurchase={() => {
          setIsPreviewModalOpen(false);
          if (selectedJob) handlePurchaseClick(selectedJob);
        }}
      />

      <BuyCreditsModal
        isOpen={isBuyCreditsModalOpen}
        onClose={() => setIsBuyCreditsModalOpen(false)}
        onPurchase={handleBuyCredits}
      />
    </DashboardLayout>
  );
};

export default FindJobsPage;
