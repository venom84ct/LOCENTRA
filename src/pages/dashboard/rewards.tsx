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

const rewardItems: RewardItem[] = [
  {
    id: "coles",
    name: "$10 Coles Gift Card",
    description: "Spend at any Coles supermarket",
    pointCost: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Coles_Supermarkets_Logo.svg/320px-Coles_Supermarkets_Logo.svg.png",
  },
  {
    id: "bunnings",
    name: "$10 Bunnings Gift Card",
    description: "Use at any Bunnings Warehouse store",
    pointCost: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Bunnings_Warehouse_logo.svg/2560px-Bunnings_Warehouse_logo.svg.png",
  },
  {
    id: "jbhifi",
    name: "$10 JB Hi-Fi Gift Card",
    description: "Use online or in any JB Hi-Fi store",
    pointCost: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/JB_Hi-Fi_logo.svg/2560px-JB_Hi-Fi_logo.svg.png",
  },
  {
    id: "myer",
    name: "$10 Myer Gift Card",
    description: "Shop across all Myer departments",
    pointCost: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Myer_logo.svg/2560px-Myer_logo.svg.png",
  },
  {
    id: "bcf",
    name: "$10 BCF Gift Card",
    description: "Great for boating, camping or fishing gear",
    pointCost: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Boating_Camping_Fishing_logo.svg/2560px-Boating_Camping_Fishing_logo.svg.png",
  },
  {
    id: "prezzee",
    name: "$10 Prezzee Smart eGift Card",
    description: "Redeemable across 100+ Australian retailers",
    pointCost: 1,
    image:
      "https://cdn.prz.io/images/prezzee-logo.svg", // You can replace this with a cleaner Prezzee image if needed
  },
  {
    id: "free-emergency",
    name: "Free Emergency Job Posting",
    description: "Post one emergency job for free (normally $10)",
    pointCost: 1,
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&q=80",
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
            {rewardItems.map((reward) => (
              <Card key={reward.id} className="bg-white">
                <div className="aspect-video w-full overflow-hidden bg-white flex items-center justify-center p-4">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="h-full object-contain"
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
                        {reward.pointCost} point
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
                        alert(`Manually confirm: ${reward.name} redeemed!`);
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
