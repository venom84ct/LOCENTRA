import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Gift, Clock, AlertCircle } from "lucide-react";

interface RewardOption {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  value: string;
  image?: string;
}

interface RewardsCardProps {
  userType: "centraResident" | "tradie";
  points: number;
  canRedeem: boolean;
  cooldownDays?: number;
}

const rewardOptions: RewardOption[] = [
  {
    id: "coles-5",
    name: "Coles Gift Card",
    description: "$5 Coles digital gift card",
    pointsCost: 150,
    value: "$5",
    image:
      "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=100&q=80",
  },
  {
    id: "woolworths-10",
    name: "Woolworths Voucher",
    description: "$10 Woolworths digital voucher",
    pointsCost: 300,
    value: "$10",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=100&q=80",
  },
  {
    id: "bunnings-15",
    name: "Bunnings Gift Card",
    description: "$15 Bunnings digital gift card",
    pointsCost: 450,
    value: "$15",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45249be83?w=100&q=80",
  },
  {
    id: "jbhifi-20",
    name: "JB Hi-Fi Gift Card",
    description: "$20 JB Hi-Fi digital gift card",
    pointsCost: 600,
    value: "$20",
    image:
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=100&q=80",
  },
];

const RewardsCard: React.FC<RewardsCardProps> = ({
  userType,
  points,
  canRedeem,
  cooldownDays = 0,
}) => {
  const [selectedReward, setSelectedReward] =
    React.useState<RewardOption | null>(null);

  const handleRedeemReward = () => {
    // In a real app, this would call an API to redeem the reward
    console.log(`Redeeming reward: ${selectedReward?.name}`);
    // Reset selected reward
    setSelectedReward(null);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="mr-2 h-5 w-5" /> Rewards Program
        </CardTitle>
        <CardDescription>
          {userType === "centraResident"
            ? "Earn points for completed jobs and redeem for rewards"
            : "Earn rewards based on your weekly performance"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userType === "centraResident" ? (
          <>
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg mb-6">
              <div>
                <p className="text-sm text-gray-500">Available Points</p>
                <p className="text-3xl font-bold">{points}</p>
              </div>
              {!canRedeem && cooldownDays > 0 && (
                <div className="flex items-center text-amber-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Cooldown: {cooldownDays} days remaining
                  </span>
                </div>
              )}
            </div>

            <h3 className="font-medium mb-3">Available Rewards</h3>
            <div className="space-y-3">
              {rewardOptions.map((reward) => {
                const canAfford = points >= reward.pointsCost;
                return (
                  <div
                    key={reward.id}
                    className={`flex justify-between items-center p-3 border rounded-lg ${!canAfford || !canRedeem ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center">
                      {reward.image && (
                        <div className="h-10 w-10 rounded overflow-hidden mr-3">
                          <img
                            src={reward.image}
                            alt={reward.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-gray-500">
                          {reward.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{reward.pointsCost} points</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            disabled={!canAfford || !canRedeem}
                            onClick={() => setSelectedReward(reward)}
                          >
                            Redeem
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Redeem Reward</AlertDialogTitle>
                            <AlertDialogDescription>
                              <div className="space-y-4">
                                <p>
                                  You are about to redeem{" "}
                                  <strong>{reward.name}</strong> for{" "}
                                  <strong>{reward.pointsCost} points</strong>.
                                </p>
                                <div className="bg-muted p-4 rounded-md">
                                  <div className="flex justify-between">
                                    <span>Current Points:</span>
                                    <span className="font-medium">
                                      {points}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Cost:</span>
                                    <span className="font-medium">
                                      {reward.pointsCost} points
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Remaining Points:</span>
                                    <span className="font-medium">
                                      {points - reward.pointsCost} points
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                                  <span className="text-sm">
                                    After redeeming, you'll need to wait 7 days
                                    before redeeming another reward.
                                  </span>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRedeemReward}>
                              Confirm Redemption
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          // Tradie rewards view
          <>
            <div className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Weekly Performance Score</h3>
                <p className="text-3xl font-bold mb-2">{points} points</p>
                <Progress value={(points / 50) * 100} className="h-2" />
                <p className="text-sm text-gray-500 mt-2">
                  Current Rank: <span className="font-medium">3rd Place</span>
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Weekly Rewards</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">1st Place</p>
                      <p className="text-sm text-gray-500">
                        Top performer of the week
                      </p>
                    </div>
                    <Badge className="bg-yellow-500">5 Free Leads</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">2nd Place</p>
                      <p className="text-sm text-gray-500">Runner-up</p>
                    </div>
                    <Badge className="bg-gray-400">3 Free Leads</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg border-primary">
                    <div>
                      <p className="font-medium">3rd Place</p>
                      <p className="text-sm text-gray-500">Your current rank</p>
                    </div>
                    <Badge>1 Free Lead</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Scoring System</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-500 font-medium mr-1">+5</span>
                    Complete a job
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 font-medium mr-1">+5</span>
                    5-star review
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 font-medium mr-1">+2</span>
                    Quick response
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 font-medium mr-1">-5</span>
                    Customer complaint
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 font-medium mr-1">-3</span>
                    Late to job
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 font-medium mr-1">-2</span>
                    Slow response
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          {userType === "centraResident"
            ? "Earn 10 points for standard jobs, 20 for emergency jobs"
            : "Rankings reset every Sunday at midnight"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default RewardsCard;
