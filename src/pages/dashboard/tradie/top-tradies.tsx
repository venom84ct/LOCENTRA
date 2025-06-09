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
import {
  Award,
  CheckCircle,
  Medal,
  Star,
  Trophy,
  Info,
} from "lucide-react";
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
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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

        <div className="mt-8 p-4 border rounded-lg bg-white">
          <div className="flex items-center mb-2">
            <Info className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">How the Leaderboard Works</h2>
          </div>
          <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
            <li><strong>Job Completion</strong>: 50 points per job + 10 bonus for emergencies</li>
            <li><strong>Customer Reviews</strong>:
              <ul className="list-disc ml-6">
                <li>5-star: +25 pts</li>
                <li>4-star: +15 pts</li>
                <li>3-star: +5 pts</li>
                <li>2-star: -10 pts</li>
                <li>1-star: -25 pts</li>
              </ul>
            </li>
            <li><strong>Leaderboard resets</strong> every Sunday at midnight</li>
            <li><strong>Scores</strong> are based on a rolling 90-day period</li>
          </ul>

          <div className="mt-4 text-sm">
            <h3 className="font-medium mb-2">Weekly Rewards</h3>
            <ul className="list-decimal ml-6 space-y-1 text-muted-foreground">
              <li>🥇 1st: 25 free credits + gold badge + featured search placement</li>
              <li>🥈 2nd: 20 free credits + silver badge</li>
              <li>🥉 3rd: 15 free credits + bronze badge</li>
              <li>4th: 10 free credits</li>
              <li>5th: 5 free credits</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TopTradiesPage;
