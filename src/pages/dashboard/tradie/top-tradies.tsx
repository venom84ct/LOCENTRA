// src/pages/dashboard/tradie/top-tradies.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, CheckCircle, Medal, Star, Trophy, Info } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const getBadgeIcon = (rank: number) => {
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

const TopTradiesPage = () => {
  const [tradies, setTradies] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopTradies = async () => {
      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("id, first_name, last_name, avatar_url, trade_category, rating_avg, rating_count, jobs_completed, score")
        .order("score", { ascending: false })
        .limit(5);

      if (!error && data) {
        setTradies(data);
      }
    };
    fetchTopTradies();
  }, []);

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Top Tradies</h1>
          <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Leaderboard Week Ending {new Date().toLocaleDateString("en-AU")}
          </div>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>
              The top 5 performing tradies this week, based on completed jobs and reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tradies.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 pb-4">
                No tradies on the leaderboard yet.
              </p>
            ) : (
              tradies.map((tradie, index) => {
                const rating = tradie.rating_avg ?? 0;
                const jobsCompleted = tradie.jobs_completed ?? 0;
                const score = tradie.score ?? 0;

                return (
                  <div
                    key={tradie.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getRankClass(index + 1)}`}
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary font-bold h-10 w-10 rounded-full flex items-center justify-center mr-4">
                        {getBadgeIcon(index + 1)}
                      </div>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={tradie.avatar_url} />
                        <AvatarFallback>
                          {(tradie.first_name?.[0] || "") + (tradie.last_name?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {tradie.first_name} {tradie.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tradie.trade_category || "Unspecified"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex justify-end">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 inline text-green-500 mr-1" />
                        {jobsCompleted} jobs completed
                      </div>
                      <p className="text-primary font-bold mt-1">{score} points</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted-50">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Info className="h-5 w-5" />
              <CardTitle>How the Leaderboard Works</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>
              🏆 <strong>Points System:</strong> Tradies earn leaderboard points every week:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>+10 points for every <strong>completed job</strong></li>
              <li>+5 points for each <strong>5-star review</strong></li>
              <li>Points reset every <strong>Monday at midnight</strong></li>
            </ul>
            <p>
              🪙 <strong>Weekly Rewards:</strong> Top 3 tradies get <strong>bonus credits</strong> added to their account.
            </p>
            <p>
              💡 To stay on top, complete jobs and keep your customers happy!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TopTradiesPage;
