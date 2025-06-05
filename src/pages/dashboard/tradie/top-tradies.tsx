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

const TopTradiesPage = () => {
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
  };

  const mockTopTradies = [
    { id: "1", name: "Mike Johnson", avatar: user.avatar, trade: "Plumber", rating: 4.9, jobsCompleted: 12, score: 950, rank: 1 },
    { id: "2", name: "Sarah Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", trade: "Electrician", rating: 4.8, jobsCompleted: 10, score: 920, rank: 2 },
    { id: "3", name: "David Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", trade: "Roofer", rating: 4.7, jobsCompleted: 8, score: 880, rank: 3 },
    { id: "4", name: "Emma Thompson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", trade: "Landscaper", rating: 4.6, jobsCompleted: 7, score: 850, rank: 4 },
    { id: "5", name: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", trade: "Carpenter", rating: 4.5, jobsCompleted: 6, score: 820, rank: 5 },
  ];

  const renderStars = (rating) => (
    <div className="flex">{
      Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))
    }<span className="ml-1 text-sm">{rating.toFixed(1)}</span></div>
  );

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <span className="font-bold text-lg">{rank}</span>;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return "bg-yellow-50 border-yellow-200";
      case 2: return "bg-gray-50 border-gray-200";
      case 3: return "bg-amber-50 border-amber-200";
      default: return "";
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
              <span className="font-medium">This Week's Standings</span>
            </div>
          </div>

          <Card className="bg-white mb-8">
            <CardHeader>
              <CardTitle>Tradie Leaderboard</CardTitle>
              <CardDescription>Top tradies based on weekly performance</CardDescription>
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
                        <AvatarFallback>{tradie.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tradie.name}</p>
                        <p className="text-sm text-muted-foreground">{tradie.trade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(tradie.rating)}
                      <div className="flex items-center justify-end mt-1">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        <p className="text-sm text-muted-foreground">{tradie.jobsCompleted} jobs</p>
                      </div>
                      <p className="font-bold text-primary mt-1">{tradie.score} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Scoring Works</CardTitle>
              <CardDescription>Earn points, climb the leaderboard, and win weekly rewards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Scoring</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Each completed job: <strong>+50 points</strong></li>
                  <li>Emergency job bonus: <strong>+10 points</strong></li>
                  <li>5-star review: <strong>+25 points</strong></li>
                  <li>4-star review: <strong>+15 points</strong></li>
                  <li>3-star review: <strong>+5 points</strong></li>
                  <li>2-star review: <strong>-10 points</strong></li>
                  <li>1-star review: <strong>-25 points</strong></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Weekly Rewards</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li><strong>1st Place:</strong> 25 credits + Gold badge</li>
                  <li><strong>2nd Place:</strong> 20 credits + Silver badge</li>
                  <li><strong>3rd Place:</strong> 15 credits + Bronze badge</li>
                  <li><strong>4th Place:</strong> 10 credits</li>
                  <li><strong>5th Place:</strong> 5 credits</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Cycle & Reset</h3>
                <p className="text-sm text-muted-foreground">
                  Points accumulate from Monday 12:00 AM and reset every Sunday at 11:59 PM. Badges are awarded on Sunday night and remain visible on tradie profiles for the full next week.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TopTradiesPage;
