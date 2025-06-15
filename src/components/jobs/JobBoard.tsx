import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Filter,
  Search,
  MapPin,
  Clock,
  Wallet,
  Star,
  AlertCircle,
  CheckCircle,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface JobBoardProps {
  userType?: "homeowner" | "tradie";
  credits?: number;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  type: "standard" | "emergency";
  status: "open" | "assigned" | "in-progress" | "completed";
  postedDate: string;
  dueDate?: string;
  budget?: string;
  homeowner?: {
    name: string;
    avatar: string;
    rating: number;
  };
  tradie?: {
    name: string;
    avatar: string;
    rating: number;
  };
}

const JobBoard: React.FC<JobBoardProps> = ({
  userType = "homeowner",
  credits = 25,
}) => {
  const [activeTab, setActiveTab] = useState(
    userType === "homeowner" ? "my-jobs" : "available-jobs",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // Mock data for jobs
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Bathroom Renovation",
      description:
        "Complete renovation of a small bathroom including new tiles, toilet, and vanity installation.",
      location: "Sydney, NSW",
      category: "Plumbing",
      type: "standard",
      status: "open",
      postedDate: "2023-06-15",
      dueDate: "2023-07-30",
      budget: "$2,500 - $3,500",
      homeowner: {
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        rating: 4.8,
      },
    },
    {
      id: "2",
      title: "Leaking Roof Repair",
      description:
        "Urgent repair needed for a leaking roof during rainy season. Water damage already visible in ceiling.",
      location: "Melbourne, VIC",
      category: "Roofing",
      type: "emergency",
      status: "open",
      postedDate: "2023-06-18",
      budget: "$800 - $1,200",
      homeowner: {
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        rating: 4.5,
      },
    },
    {
      id: "3",
      title: "Kitchen Backsplash Installation",
      description:
        "Need a professional to install a tile backsplash in kitchen. Materials already purchased.",
      location: "Brisbane, QLD",
      category: "Tiling",
      type: "standard",
      status: "in-progress",
      postedDate: "2023-06-10",
      dueDate: "2023-06-25",
      budget: "$600 - $900",
      homeowner: {
        name: "Michael Brown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        rating: 4.2,
      },
      tradie: {
        name: "Robert Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
        rating: 4.9,
      },
    },
    {
      id: "4",
      title: "Electrical Wiring Issue",
      description:
        "Power outage in part of the house. Need licensed electrician to diagnose and fix the problem.",
      location: "Perth, WA",
      category: "Electrical",
      type: "emergency",
      status: "assigned",
      postedDate: "2023-06-17",
      budget: "$300 - $700",
      homeowner: {
        name: "Emily Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        rating: 4.7,
      },
      tradie: {
        name: "James Thompson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
        rating: 4.8,
      },
    },
    {
      id: "5",
      title: "Fence Installation",
      description:
        "Need 30 meters of wooden fence installed around property. Materials to be provided by tradie.",
      location: "Adelaide, SA",
      category: "Fencing",
      type: "standard",
      status: "completed",
      postedDate: "2023-05-20",
      dueDate: "2023-06-10",
      budget: "$3,000 - $4,500",
      homeowner: {
        name: "David Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        rating: 4.6,
      },
      tradie: {
        name: "Thomas Anderson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
        rating: 4.9,
      },
    },
  ];

  // Filter jobs based on search query and filters
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;

    // For homeowners, show only their jobs
    // For tradies, show available jobs or jobs they're assigned to
    if (userType === "homeowner") {
      return matchesSearch && matchesCategory && matchesType;
    } else {
      // For tradies in 'available-jobs' tab, only show open jobs
      if (activeTab === "available-jobs") {
        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          job.status === "open"
        );
      }
      // For tradies in 'my-jobs' tab, only show jobs they're assigned to
      else if (activeTab === "my-jobs") {
        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          (job.status === "assigned" ||
            job.status === "in-progress" ||
            job.status === "completed") &&
          job.tradie?.name === "James Thompson"
        ); // Mock current tradie
      }
    }

    return false;
  });

  const handlePurchaseLead = (job: Job) => {
    setSelectedJob(job);
    setAlertDialogOpen(true);
  };

  const confirmPurchaseLead = () => {
    // Logic to purchase lead would go here
    // In a real app, this would deduct credits from the user's account
    // and record the transaction in the database
    setAlertDialogOpen(false);
    // Show job details after purchase
    setDialogOpen(true);

    // If this was a real app with a database, we would also:
    // 1. Record the lead purchase transaction
    // 2. Update the tradie's credit balance
    // 3. Make the homeowner's contact details available to the tradie
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500">Open</Badge>;
      case "assigned":
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "emergency" ? (
      <Badge className="bg-red-500">Emergency</Badge>
    ) : (
      <Badge className="bg-blue-500">Standard</Badge>
    );
  };

  const renderJobCard = (job: Job) => (
    <Card key={job.id} className="mb-4 bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" /> {job.location}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {getTypeBadge(job.type)}
            {getStatusBadge(job.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">
              Posted: {job.postedDate}
            </span>
          </div>
          {job.budget && (
            <div className="flex items-center">
              <Wallet className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-500">{job.budget}</span>
            </div>
          )}
        </div>
        {job.homeowner && (
          <div className="flex items-center mt-4">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage
                src={job.homeowner.avatar}
                alt={job.homeowner.name}
              />
              <AvatarFallback>{job.homeowner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{job.homeowner.name}</span>
            <div className="flex items-center ml-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs ml-1">{job.homeowner.rating}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {userType === "tradie" && job.status === "open" ? (
          <Button
            onClick={() => handlePurchaseLead(job)}
            className="w-full"
            variant={job.type === "emergency" ? "destructive" : "default"}
          >
            Purchase Lead ({job.type === "emergency" ? "2" : "1"} Credits)
          </Button>
        ) : (
          <Button
            onClick={() => handleViewJobDetails(job)}
            className="w-full"
            variant="outline"
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  const renderHomeownerTabs = () => (
    <Tabs
      defaultValue="my-jobs"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="my-jobs">
        <div className="mb-4">
          <Button className="w-full">Create New Job</Button>
        </div>
        {filteredJobs.map(renderJobCard)}
      </TabsContent>
      <TabsContent value="in-progress">
        {filteredJobs
          .filter((job) => job.status === "in-progress")
          .map(renderJobCard)}
      </TabsContent>
      <TabsContent value="completed">
        {filteredJobs
          .filter((job) => job.status === "completed")
          .map(renderJobCard)}
      </TabsContent>
    </Tabs>
  );

  const renderTradieTabs = () => (
    <Tabs
      defaultValue="available-jobs"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="available-jobs">Available Jobs</TabsTrigger>
        <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
        <TabsTrigger value="wallet">Credit Wallet</TabsTrigger>
      </TabsList>
      <TabsContent value="available-jobs">
        {filteredJobs.map(renderJobCard)}
      </TabsContent>
      <TabsContent value="my-jobs">
        {filteredJobs
          .filter(
            (job) =>
              (job.status === "assigned" ||
                job.status === "in-progress" ||
                job.status === "completed") &&
              job.tradie?.name === "James Thompson", // Mock current tradie
          )
          .map(renderJobCard)}
      </TabsContent>
      <TabsContent value="wallet">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Credit Wallet</CardTitle>
            <CardDescription>
              Purchase and manage your lead credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <p className="text-sm text-gray-500">Available Credits</p>
                <p className="text-3xl font-bold">{credits}</p>
              </div>
              <Button>Buy More Credits</Button>
            </div>

            <h3 className="font-medium mb-3">Credit Bundles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Starter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">$25</p>
                  <p className="text-sm text-gray-500">5 Credits</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Purchase</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Standard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">$45</p>
                  <p className="text-sm text-gray-500">10 Credits</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Purchase</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">$80</p>
                  <p className="text-sm text-gray-500">20 Credits</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Purchase</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Elite</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">$180</p>
                  <p className="text-sm text-gray-500">50 Credits</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Purchase</Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          {userType === "homeowner" ? "Manage Your Jobs" : "Find Jobs"}
        </h1>

        {userType === "tradie" && activeTab !== "wallet" && (
          <div className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            <span className="font-medium">{credits} Credits Available</span>
          </div>
        )}
      </div>

      {activeTab !== "wallet" && (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Roofing">Roofing</SelectItem>
                <SelectItem value="Tiling">Tiling</SelectItem>
                <SelectItem value="Fencing">Fencing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {userType === "homeowner" ? renderHomeownerTabs() : renderTradieTabs()}

      {/* Job Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <DialogTitle>{selectedJob.title}</DialogTitle>
                  <div className="flex space-x-2">
                    {getTypeBadge(selectedJob.type)}
                    {getStatusBadge(selectedJob.status)}
                  </div>
                </div>
                <DialogDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" /> {selectedJob.location}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Posted Date</p>
                    <p className="text-sm text-gray-500">
                      {selectedJob.postedDate}
                    </p>
                  </div>
                </div>

                {selectedJob.dueDate && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-gray-500">
                        {selectedJob.dueDate}
                      </p>
                    </div>
                  </div>
                )}

                {selectedJob.budget && (
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-sm text-gray-500">
                        {selectedJob.budget}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-600">
                  {selectedJob.description}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                {selectedJob.homeowner && (
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-sm font-medium mb-2">Homeowner</h3>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={selectedJob.homeowner.avatar}
                          alt={selectedJob.homeowner.name}
                        />
                        <AvatarFallback>
                          {selectedJob.homeowner.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedJob.homeowner.name}
                        </p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">
                            {selectedJob.homeowner.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedJob.tradie && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Assigned Tradie
                    </h3>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={selectedJob.tradie.avatar}
                          alt={selectedJob.tradie.name}
                        />
                        <AvatarFallback>
                          {selectedJob.tradie.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedJob.tradie.name}</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">
                            {selectedJob.tradie.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                {userType === "tradie" && selectedJob.status === "open" ? (
                  <Button
                    onClick={() => {
                      setDialogOpen(false);
                      setAlertDialogOpen(true);
                    }}
                  >
                    Express Interest
                  </Button>
                ) : userType === "homeowner" &&
                  selectedJob.status === "open" ? (
                  <Button variant="outline" className="mr-2">
                    Edit Job
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setDialogOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Purchase Lead Alert Dialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purchase Lead</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedJob && (
                <>
                  <p className="mb-2">
                    You are about to purchase the lead for:
                  </p>
                  <p className="font-medium">{selectedJob.title}</p>
                  <div className="flex items-center mt-2 mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {selectedJob.location}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="flex justify-between items-center">
                      <span>Cost:</span>
                      <span className="font-medium">
                        {selectedJob.type === "emergency" ? "2" : "1"} Credits
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Your balance:</span>
                      <span className="font-medium">{credits} Credits</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Remaining balance:</span>
                      <span className="font-medium">
                        {credits - (selectedJob.type === "emergency" ? 2 : 1)}{" "}
                        Credits
                      </span>
                    </div>
                  </div>

                  <p className="text-sm">
                    {selectedJob.type === "emergency" ? (
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                        <span>
                          This is an emergency job that requires immediate
                          attention.
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>
                          Once purchased, you'll get full access to job details
                          and can contact the homeowner directly.
                        </span>
                      </div>
                    )}
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPurchaseLead}>
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobBoard;
