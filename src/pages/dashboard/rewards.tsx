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

const mockRewards: RewardItem[] = [
  {
    id: "reward1",
    name: "$50 Coles Gift Card",
    description: "$50 Coles digital gift card",
    pointCost: 500,
  },
  {
    id: "reward2",
    name: "$50 JB Hi-Fi Gift Card",
    description: "$50 JB Hi-Fi voucher for electronics and more",
    pointCost: 500,
  },
  {
    id: "reward3",
    name: "$50 Bunnings Gift Card",
    description: "$50 Bunnings gift card for home & tools",
    pointCost: 500,
  },
  {
    id: "reward4",
    name: "$50 Myer Gift Card",
    description: "$50 gift card for Myer department store",
    pointCost: 500,
  },
  {
    id: "reward5",
    name: "$50 BCF Gift Card",
    description: "$50 BCF gift card for outdoor gear",
    pointCost: 500,
  },
  {
    id: "reward6",
    name: "Prezzee Smart eGift Card",
    description: "Flexi voucher usable at 100+ Aussie retailers",
    pointCost: 500,
  },
  {
    id: "reward7",
    name: "Free Emergency Job Posting",
    description: "Normally $10 — post 1 emergency job free",
    pointCost: 250,
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

  if (!user) return null;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="container mx-auto px-4">
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
                  <span>Complete a job: 15 points</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Leave a review: 10 points</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Post an emergency job: 25 points</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className="bg-white">
                <div className="w-full h-52 overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src="https://nlgiukcwbexfxkzdvzzq.supabase.co/storage/v1/object/public/public-assets//rewards.png"
                    alt={reward.name}
                    className="max-h-full max-w-full object-contain p-4"
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
                        user.reward_points >= reward.pointCost
                          ? "default"
                          : "outline"
                      }
                      disabled={user.reward_points < reward.pointCost}
                      onClick={() => {
                        if (user.reward_points >= reward.pointCost) {
                          alert(`Reward "${reward.name}" redeemed successfully!`);
                          // redemption logic will go here
                        }
                      }}
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
