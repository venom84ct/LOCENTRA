import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
    name: "$50 Home Depot Gift Card",
    description: "$50 gift card to spend at any Home Depot store",
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
    description:
      "Get your job featured at the top of search results for 7 days",
    pointCost: 300,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
  },
  {
    id: "reward4",
    name: "$100 Bunnings Gift Card",
    description: "$100 gift card to spend at any Bunnings store",
    pointCost: 1000,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80",
  },
  {
    id: "reward5",
    name: "Priority Support",
    description: "Get priority customer support for 3 months",
    pointCost: 200,
    image:
      "https://images.unsplash.com/photo-1560264280-88b68371db39?w=300&q=80",
  },
  {
    id: "reward6",
    name: "Exclusive Tradie Discounts",
    description: "Access to exclusive discounts from our partner tradies",
    pointCost: 150,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=300&q=80",
  },
];

const RewardsPage = () => {
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    unreadMessages: 2,
    unreadNotifications: 3,
    rewardPoints: 350,
  };

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Rewards</h1>
            <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center">
              <Gift className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">
                {user.rewardPoints} points available
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
                  <span>Post a job: 10 points</span>
                </li>
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
                  <span>Refer a friend: 100 points</span>
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
                      <span className="font-medium">
                        {reward.pointCost} points
                      </span>
                    </div>
                    <Button
                      variant={
                        user.rewardPoints >= reward.pointCost
                          ? "default"
                          : "outline"
                      }
                      disabled={user.rewardPoints < reward.pointCost}
                      onClick={() => {
                        if (user.rewardPoints >= reward.pointCost) {
                          // In a real app, this would call an API to redeem the reward
                          alert(`Reward ${reward.name} redeemed successfully!`);
                        }
                      }}
                    >
                      {user.rewardPoints >= reward.pointCost
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
