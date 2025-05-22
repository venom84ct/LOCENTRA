import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Award, Trophy, Medal, CheckCircle } from "lucide-react";

interface TopTradie {
  id: string;
  name: string;
  avatar: string;
  trade: string;
  rating: number;
  jobsCompleted: number;
  score: number;
  rank: number;
}

const TopTradiesPage = () => {
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    unreadMessages: 1,
    unreadNotifications: 2,
  };

  const mockTopTradies: TopTradie[] = [
    {
      id: "tradie1",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      trade: "Plumber",
      rating: 4.9,
      jobsCompleted: 12,
      score: 950,
      rank: 1,
    },
    {
      id: "tradie2",
      name: "Sarah Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      trade: "Electrician",
      rating: 4.8,
      jobsCompleted: 10,
      score: 920,
      rank: 2,
    },
    {
      id: "tradie3",
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      trade: "Roofer",
      rating: 4.7,
      jobsCompleted: 8,
      score: 880,
      rank: 3,
    },
    {
      id: "tradie4",
      name: "Emma Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      trade: "Landscaper",
      rating: 4.6,
      jobsCompleted: 7,
      score: 850,
      rank: 4,
    },
    {
      id: "tradie5",
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      trade: "Carpenter",
      rating: 4.5,
      jobsCompleted: 6,
      score: 820,
      rank: 5,
    },
  ];

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold text-lg">{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200";
      case 2:
        return "bg-gray-50 border-gray-200";
      case 3:
        return "bg-amber-50 border-amber-200";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Top Tradies</h1>
            <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">Week 23, 2023</span>
            </div>
          </div>

          <Card className="bg-white mb-8">
            <CardHeader>
              <CardTitle>Tradie Leaderboard</CardTitle>
              <CardDescription>
                Top performing tradies based on our scoring system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopTradies.map((tradie) => (
                  <div
                    key={tradie.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getRankClass(tradie.rank)}`}
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary font-bold h-10 w-10 rounded-full flex items-center justify-center mr-4">
                        {getRankIcon(tradie.rank)}
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={tradie.avatar} alt={tradie.name} />
                        <AvatarFallback>
                          {tradie.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tradie.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tradie.trade}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {renderStars(tradie.rating)}
                      </div>
                      <div className="flex items-center justify-end mt-1">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        <p className="text-sm text-muted-foreground">
                          {tradie.jobsCompleted} jobs completed
                        </p>
                      </div>
                      <p className="font-bold text-primary mt-1">
                        {tradie.score} points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>How Scoring Works</CardTitle>
              <CardDescription>
                Understanding how tradies are ranked on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Scoring System</h3>
                  <p className="text-muted-foreground mb-4">
                    Our scoring system is designed to reward tradies who provide
                    excellent service and maintain high standards of
                    professionalism.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Job Completion
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>
                            Each completed job:{" "}
                            <span className="font-medium">50 points</span>
                          </li>
                          <li>
                            Emergency job completion:{" "}
                            <span className="font-medium">
                              +10 bonus points
                            </span>
                          </li>
                          <li>
                            On-time completion:{" "}
                            <span className="font-medium">+5 bonus points</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Customer Reviews
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>
                            5-star review:{" "}
                            <span className="font-medium">25 points</span>
                          </li>
                          <li>
                            4-star review:{" "}
                            <span className="font-medium">15 points</span>
                          </li>
                          <li>
                            3-star review:{" "}
                            <span className="font-medium">5 points</span>
                          </li>
                          <li>
                            2-star review:{" "}
                            <span className="font-medium">-10 points</span>
                          </li>
                          <li>
                            1-star review:{" "}
                            <span className="font-medium">-25 points</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Rewards for Top Tradies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                          1st Place
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>25 free credits</li>
                          <li>Gold badge on profile</li>
                          <li>Featured placement in search results</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Medal className="h-5 w-5 text-gray-400 mr-2" />
                          2nd Place
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>20 free credits</li>
                          <li>Silver badge on profile</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Medal className="h-5 w-5 text-amber-700 mr-2" />
                          3rd Place
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>15 free credits</li>
                          <li>Bronze badge on profile</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">4th Place</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>10 free credits</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">5th Place</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>5 free credits</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Leaderboard Updates
                  </h3>
                  <p className="text-muted-foreground">
                    The leaderboard resets every Sunday at midnight. Points are
                    accumulated over a rolling 90-day period. This ensures that
                    the rankings reflect recent performance while still
                    rewarding consistent quality service over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TopTradiesPage;
