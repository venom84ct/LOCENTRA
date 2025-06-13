import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift } from "lucide-react";

interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  image: string;
}

const mockRewards: RewardItem[] = [
  {
    id: "reward1",
    name: "$50 Prezzee Smart eGift Card",
    description: "Redeemable across 100+ Aussie retailers",
    pointCost: 500,
    image:
      "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=300&q=80",
  },
  {
    id: "reward2",
    name: "Free Emergency Job Posting",
    description: "Post one emergency job for free (normally $25)",
    pointCost: 250,
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&q=80",
  },
  {
    id: "reward3",
    name: "Premium Job Listing",
    description: "Get your job featured at the top of search results for 7 days",
    pointCost: 300,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
  },
];

const RewardsPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", userId)
        .single();

      setUser(profile);
    };

    fetchUser();
  }, []);

  const handleRedeem = async (reward: RewardItem) => {
    if (!user || user.reward_points < reward.pointCost) return;

    const { error } = await supabase
      .from("profile_centra_resident")
      .update({
        reward_points: user.reward_points - reward.pointCost,
      })
      .eq("id", user.id);

    if (!error) {
      await supabase.from("reward_redemptions").insert({
        user_id: user.id,
        reward_name: reward.name,
        email: user.email,
        status: "pending",
        method: "manual",
      });

      alert(`Reward "${reward.name}" redeemed successfully! We'll email your Prezzee gift card soon.`);
      setUser((prev: any) => ({
        ...prev,
        reward_points: prev.reward_points - reward.pointCost,
      }));
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Rewards</h1>
            <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center">
              <Gift className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">{user.reward_points} points available</span>
            </div>
          </div>

          <Card className="bg-white mb-6">
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
              <CardDescription>Earn rewards by using the Locentra platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Complete a job: 50 points</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Leave a review: 25 points</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Refer a friend: 60 points (after they register)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className="bg-white">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{reward.pointCost} points</span>
                    </div>
                    <Button
                      variant={
                        user.reward_points >= reward.pointCost ? "default" : "outline"
                      }
                      disabled={user.reward_points < reward.pointCost}
                      onClick={() => handleRedeem(reward)}
                    >
                      {user.reward_points >= reward.pointCost
                        ? "Redeem"
                        : "Not Enough Points"}
                    </Button>
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

export default RewardsPage;
