import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Briefcase,
  CheckCircle,
  Star,
  PlusCircle,
} from "lucide-react";

interface Review {
  id: string;
  homeownerId: string;
  homeownerName: string;
  homeownerAvatar: string;
  jobId: string;
  jobTitle: string;
  rating: number;
  comment: string;
  date: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
}

const TradieProfilePage = () => {
  // Mock user data - in a real app, this would come from authentication
  const [user, setUser] = useState({
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    phone: "0412 345 678",
    address: "456 Tradie St, Sydney, NSW 2000",
    memberSince: "January 2023",
    bio: "Licensed plumber with over 10 years of experience in residential and commercial plumbing services.",
    trade: "Plumber",
    license: "PL-12345",
    abn: "12 345 678 901",
    verificationStatus: "verified",
    specialties: [
      "Emergency Repairs",
      "Bathroom Renovations",
      "Hot Water Systems",
    ],
    unreadMessages: 1,
    unreadNotifications: 2,
    rating: 4.8,
    reviewCount: 27,
  });

  const mockReviews: Review[] = [
    {
      id: "review1",
      homeownerId: "homeowner3",
      homeownerName: "Emma Johnson",
      homeownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      jobId: "lead5",
      jobTitle: "Leaking Shower Repair",
      rating: 5,
      comment:
        "Mike did an excellent job fixing our leaking shower. He was professional, on time, and cleaned up after the work was done. Highly recommend!",
      date: "2023-05-30",
    },
    {
      id: "review2",
      homeownerId: "homeowner4",
      homeownerName: "David Chen",
      homeownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      jobId: "job-past1",
      jobTitle: "Water Heater Installation",
      rating: 4,
      comment:
        "Good work on the water heater installation. Mike was knowledgeable and efficient. Only minor issue was he arrived a bit late.",
      date: "2023-05-15",
    },
    {
      id: "review3",
      homeownerId: "homeowner5",
      homeownerName: "Lisa Taylor",
      homeownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      jobId: "job-past2",
      jobTitle: "Bathroom Sink Repair",
      rating: 5,
      comment:
        "Fantastic service! Mike responded quickly to my emergency call and fixed the issue in no time. Fair pricing and great communication.",
      date: "2023-04-22",
    },
  ];

  const mockPortfolio: PortfolioItem[] = [
    {
      id: "portfolio1",
      title: "Complete Bathroom Renovation",
      description:
        "Full renovation including new shower, toilet, sink, and tiling.",
      date: "April 2023",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      category: "Bathroom Renovation",
    },
    {
      id: "portfolio2",
      title: "Kitchen Sink Installation",
      description:
        "Replaced old sink with a modern double-basin stainless steel sink.",
      date: "March 2023",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      category: "Kitchen Plumbing",
    },
    {
      id: "portfolio3",
      title: "Hot Water System Replacement",
      description:
        "Installed a new energy-efficient hot water system for a family home.",
      date: "February 2023",
      image:
        "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&q=80",
      category: "Hot Water Systems",
    },
    {
      id: "portfolio4",
      title: "Emergency Pipe Repair",
      description:
        "Fixed a burst pipe in the basement preventing further water damage.",
      date: "January 2023",
      image:
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80",
      category: "Emergency Repairs",
    },
    {
      id: "portfolio5",
      title: "Outdoor Drainage Solution",
      description: "Installed proper drainage system to prevent yard flooding.",
      date: "December 2022",
      image:
        "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=800&q=80",
      category: "Drainage",
    },
    {
      id: "portfolio6",
      title: "Commercial Bathroom Plumbing",
      description:
        "Complete plumbing installation for a commercial office bathroom.",
      date: "November 2022",
      image:
        "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&q=80",
      category: "Commercial Plumbing",
    },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
    specialties: user.specialties.join(", "),
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    setUser((prev) => ({
      ...prev,
      ...formData,
      specialties: formData.specialties.split(",").map((item) => item.trim()),
    }));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Profile Summary Card */}
            <Card className="bg-white md:col-span-1">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {user.trade}
                  </CardDescription>
                  {user.verificationStatus === "verified" && (
                    <div className="flex items-center mt-2 text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        Verified Account
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{user.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Member since {user.memberSince}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Business Details</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          License:
                        </span>
                        <span className="text-sm">{user.license}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          ABN:
                        </span>
                        <span className="text-sm">{user.abn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details/Edit Form */}
            <Card className="bg-white md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {isEditing ? "Edit Profile" : "Profile Details"}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update your professional information below"
                    : "Your professional information and specialties"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialties">
                        Specialties (comma separated)
                      </Label>
                      <Textarea
                        id="specialties"
                        name="specialties"
                        value={formData.specialties}
                        onChange={handleChange}
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        About Me
                      </h3>
                      <p>{user.bio}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.specialties.map((specialty, index) => (
                          <div
                            key={index}
                            className="bg-primary/10 px-3 py-1 rounded-full text-sm"
                          >
                            {specialty}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Account Security
                      </h3>
                      <div className="flex justify-between items-center">
                        <span>Password</span>
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Notification Preferences
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Email Notifications</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>SMS Notifications</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Work Portfolio</h2>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockPortfolio.map((item) => (
                  <Card key={item.id} className="bg-white overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>
                        {item.date} • {item.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{item.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Customer Reviews</h2>
                <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">
                    {user.rating} ({user.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <Card className="bg-white mb-6">
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
                              src={review.homeownerAvatar}
                              alt={review.homeownerName}
                            />
                            <AvatarFallback>
                              {review.homeownerName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {review.homeownerName}
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
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
