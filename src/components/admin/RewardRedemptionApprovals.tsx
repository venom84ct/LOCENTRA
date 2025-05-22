import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Gift, CreditCard } from "lucide-react";

interface RewardRedemption {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userType: "homeowner" | "tradie";
  rewardType: "gift_card" | "voucher" | "free_leads";
  rewardName: string;
  pointCost: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

const mockRedemptions: RewardRedemption[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Smith",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    userType: "homeowner",
    rewardType: "gift_card",
    rewardName: "$50 Amazon Gift Card",
    pointCost: 500,
    requestDate: "2023-05-15",
    status: "pending",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah Williams",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    userType: "homeowner",
    rewardType: "voucher",
    rewardName: "$100 Home Depot Voucher",
    pointCost: 1000,
    requestDate: "2023-05-14",
    status: "pending",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mike Johnson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    userType: "tradie",
    rewardType: "free_leads",
    rewardName: "5 Free Job Leads",
    pointCost: 250,
    requestDate: "2023-05-13",
    status: "pending",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Emma Johnson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    userType: "homeowner",
    rewardType: "gift_card",
    rewardName: "$25 Uber Eats Gift Card",
    pointCost: 250,
    requestDate: "2023-05-12",
    status: "approved",
  },
  {
    id: "5",
    userId: "user5",
    userName: "David Chen",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    userType: "tradie",
    rewardType: "free_leads",
    rewardName: "10 Free Job Leads",
    pointCost: 500,
    requestDate: "2023-05-11",
    status: "rejected",
  },
];

const RewardRedemptionApprovals = () => {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");

  const filteredRedemptions = mockRedemptions.filter(
    (redemption) => filter === "all" || redemption.status === filter,
  );

  const handleApproveRedemption = (redemptionId: string) => {
    // In a real app, this would update the redemption status in the database
    console.log(`Approving redemption ${redemptionId}`);
  };

  const handleRejectRedemption = (redemptionId: string) => {
    // In a real app, this would update the redemption status in the database
    console.log(`Rejecting redemption ${redemptionId}`);
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case "gift_card":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "voucher":
        return <Gift className="h-5 w-5 text-purple-500" />;
      case "free_leads":
        return <Gift className="h-5 w-5 text-green-500" />;
      default:
        return <Gift className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reward Redemption Approvals</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRedemptions.map((redemption) => (
          <Card key={redemption.id} className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getRewardIcon(redemption.rewardType)}
                  <div className="ml-2">
                    <CardTitle className="text-lg">
                      {redemption.rewardName}
                    </CardTitle>
                    <CardDescription>
                      Requested on {redemption.requestDate}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    redemption.status === "approved"
                      ? "default"
                      : redemption.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {redemption.status.charAt(0).toUpperCase() +
                    redemption.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground mb-1">User</p>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={redemption.userAvatar}
                        alt={redemption.userName}
                      />
                      <AvatarFallback>
                        {redemption.userName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{redemption.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {redemption.userType.charAt(0).toUpperCase() +
                          redemption.userType.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground mb-1">
                    Point Cost
                  </p>
                  <p className="text-lg font-semibold">
                    {redemption.pointCost} points
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {redemption.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectRedemption(redemption.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApproveRedemption(redemption.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                {redemption.status === "rejected" && (
                  <Button
                    onClick={() => handleApproveRedemption(redemption.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {redemption.status === "approved" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectRedemption(redemption.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RewardRedemptionApprovals;
