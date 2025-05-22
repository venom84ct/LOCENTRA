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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Search,
  MapPin,
  Filter,
  Briefcase,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface Tradie {
  id: string;
  name: string;
  avatar: string;
  trade: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  specialties: string[];
}

const mockTradies: Tradie[] = [
  {
    id: "tradie1",
    name: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    location: "Sydney, NSW",
    rating: 4.8,
    reviewCount: 27,
    verified: true,
    description:
      "Licensed plumber with over 10 years of experience in residential and commercial plumbing services.",
    specialties: [
      "Emergency Repairs",
      "Bathroom Renovations",
      "Hot Water Systems",
    ],
  },
  {
    id: "tradie2",
    name: "Sarah Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    trade: "Electrician",
    location: "Melbourne, VIC",
    rating: 4.9,
    reviewCount: 34,
    verified: true,
    description:
      "Certified electrician specializing in residential wiring, lighting installation, and electrical repairs.",
    specialties: [
      "Lighting Installation",
      "Electrical Repairs",
      "Home Automation",
    ],
  },
  {
    id: "tradie3",
    name: "David Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    trade: "Roofer",
    location: "Brisbane, QLD",
    rating: 4.7,
    reviewCount: 19,
    verified: true,
    description:
      "Experienced roofer providing quality roof repairs, replacements, and maintenance services.",
    specialties: ["Roof Repairs", "Leak Detection", "Gutter Installation"],
  },
  {
    id: "tradie4",
    name: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    trade: "Landscaper",
    location: "Sydney, NSW",
    rating: 4.6,
    reviewCount: 15,
    verified: true,
    description:
      "Creative landscaper with a passion for transforming outdoor spaces into beautiful gardens.",
    specialties: ["Garden Design", "Irrigation Systems", "Native Plants"],
  },
  {
    id: "tradie5",
    name: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    trade: "Carpenter",
    location: "Perth, WA",
    rating: 4.5,
    reviewCount: 22,
    verified: true,
    description:
      "Skilled carpenter specializing in custom furniture, cabinetry, and home renovations.",
    specialties: ["Custom Furniture", "Kitchen Cabinets", "Deck Building"],
  },
];

const FindTradiePage = () => {
  const location = useLocation();
  const tradieId = new URLSearchParams(location.search).get("tradieId");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedTradie, setSelectedTradie] = useState<Tradie | null>(null);

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  useEffect(() => {
    if (tradieId) {
      const tradie = mockTradies.find((t) => t.id === tradieId);
      if (tradie) {
        setSelectedTradie(tradie);
      }
    }
  }, [tradieId]);

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

  const filteredTradies = mockTradies.filter((tradie) => {
    const matchesSearch =
      tradie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tradie.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tradie.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrade = selectedTrade ? tradie.trade === selectedTrade : true;

    return matchesSearch && matchesTrade;
  });

  const trades = Array.from(new Set(mockTradies.map((tradie) => tradie.trade)));

  const handleContactTradie = (tradieId: string) => {
    // Navigate to messages with this tradie
    window.location.href = `/dashboard/messages?contactId=${tradieId}`;
  };

  const handleViewProfile = (tradie: Tradie) => {
    setSelectedTradie(tradie);
  };

  const handleCloseProfile = () => {
    setSelectedTradie(null);
  };

  return (
    <DashboardLayout userType="homeowner" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Find a Tradie</h1>
          </div>

          {selectedTradie ? (
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage
                          src={selectedTradie.avatar}
                          alt={selectedTradie.name}
                        />
                        <AvatarFallback>
                          {selectedTradie.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          {selectedTradie.name}
                          {selectedTradie.verified && (
                            <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          {selectedTradie.trade}
                        </CardDescription>
                        <div className="flex items-center mt-1">
                          {renderStars(selectedTradie.rating)}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({selectedTradie.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleCloseProfile}>
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-sm">{selectedTradie.description}</p>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedTradie.location}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span className="text-sm">
                            Specialties: {selectedTradie.specialties.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-4">
                        Contact {selectedTradie.name}
                      </h3>
                      <Button
                        className="w-full"
                        onClick={() => handleContactTradie(selectedTradie.id)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
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
                          placeholder="Search tradies..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trade</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={
                            selectedTrade === null ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setSelectedTrade(null)}
                        >
                          All
                        </Badge>
                        {trades.map((trade) => (
                          <Badge
                            key={trade}
                            variant={
                              selectedTrade === trade ? "default" : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => setSelectedTrade(trade)}
                          >
                            {trade}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedTrade(null);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tradie List */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 gap-4">
                  {filteredTradies.length > 0 ? (
                    filteredTradies.map((tradie) => (
                      <Card key={tradie.id} className="bg-white">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <Avatar className="h-24 w-24 mx-auto md:mx-0">
                                <AvatarImage
                                  src={tradie.avatar}
                                  alt={tradie.name}
                                />
                                <AvatarFallback>
                                  {tradie.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="mt-4 text-center md:text-left">
                                {renderStars(tradie.rating)}
                                <p className="text-sm text-muted-foreground">
                                  {tradie.reviewCount} reviews
                                </p>
                              </div>
                            </div>
                            <div className="md:w-3/4">
                              <div className="flex flex-col md:flex-row justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {tradie.name}
                                  </h3>
                                  <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-sm">
                                      {tradie.trade}
                                    </span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-sm">
                                      {tradie.location}
                                    </span>
                                  </div>
                                </div>
                                {tradie.verified && (
                                  <Badge className="h-fit">Verified</Badge>
                                )}
                              </div>
                              <p className="text-sm my-2">
                                {tradie.description}
                              </p>
                              <div className="mt-4">
                                <p className="text-sm font-medium mb-2">
                                  Specialties:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {tradie.specialties.map(
                                    (specialty, index) => (
                                      <Badge key={index} variant="outline">
                                        {specialty}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button
                                  variant="outline"
                                  className="mr-2"
                                  onClick={() => handleViewProfile(tradie)}
                                >
                                  View Profile
                                </Button>
                                <Button
                                  onClick={() => handleContactTradie(tradie.id)}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-white">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No tradies found
                        </h3>
                        <p className="text-muted-foreground text-center mb-4">
                          We couldn't find any tradies matching your search
                          criteria.
                        </p>
                        <Button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedTrade(null);
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindTradiePage;
