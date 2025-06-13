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
}

const rewardImage =
  "https://nlgiukcwbexfxkzdvzzq.supabase.co/storage/v1/object/public/public-assets//rewards.png";

const mockRewards: RewardItem[] = [
  {
    id: "coles",
    name: "$50 Coles Gift Card",
    description: "Redeem a $50 gift card for Coles Supermarkets",
    pointCost: 500,
  },
  {
    id: "bunnings",
    name: "$50 Bunnings Gift Card",
    description: "Get tools, gardening & more at Bunnings",
    pointCost: 500,
  },
  {
    id: "jb",
    name: "$50 JB Hi-Fi Gift Card",
    description: "Redeem electronics, games and more at JB Hi-Fi",
    pointCost: 500,
  },
  {
    id: "myer",
    name: "$50 Myer Gift Card",
    description: "Spend on fashion, beauty & more at Myer",
    pointCost: 500,
  },
  {
    id: "bcf",
    name: "$50 BCF Gift Card",
    description: "Great for boating, camping and fishing gear",
    pointCost: 500,
  },
  {
    id: "emergency",
    name: "Free Emergency Job Posting",
    description: "Normally $10 — post an emergency job for free",
    pointCost: 250,
  },
  {
    id: "prezzee",
    name: "Prezzee Smart eGift Card",
    description: "Flexible eGift card usable at 100+ stores",
    pointCost: 500,
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

    const confirm = window.confirm(
      `Redeem "${reward.name}" for ${reward.pointCost} points?`
    );
    if (!confirm) return;

    const { error: updateError } = await supabase
      .from("profile_centra_resident")
      .update({ reward_points: user.reward_points - reward.pointCost })
      .eq("id", user.id);

    if (updateError) {
      alert("Failed to deduct points.");
      return;
    }

    const { error: insertError } = await supabase.from("reward_redemptions").insert({
      user_id: user.id,
      reward_name: reward.name,
      email: user.email,
      method: "manual",
      status: "pending",
    });

    if (insertError) {
      alert("Failed to log redemption.");
      return;
    }

    alert(`✅ "${reward.name}" redeemed. We'll process it shortly.`);
    location.reload();
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
              <span className="font-medium">
                {user.reward_points} points available
              </span>
            </div>
          </div>

          <Card className="bg-white mb-6">
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
              <CardDescription>
                Earn rewards by using the Locentra platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Complete a job: <strong className="ml-1">15 points</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Leave a review: <strong className="ml-1">10 points</strong>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Post an emergency job: <strong className="ml-1">25 points</strong>
                </li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className="bg-white">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={rewardImage}
                    alt={reward.name}
                    className="max-h-28 object-contain p-4"
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
                      <span className="font-medium">
                        {reward.pointCost} points
                      </span>
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
