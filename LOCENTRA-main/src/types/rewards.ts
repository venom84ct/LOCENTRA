// Types for the rewards system

export interface CentraResidentRewards {
  userId: string;
  points: number;
  lastRedemptionDate: string | null;
  totalJobsCompleted: number;
  totalPointsEarned: number;
  totalRewardsRedeemed: number;
}

export interface TradiePerformance {
  userId: string;
  weeklyScore: number;
  completedJobs: number;
  fiveStarReviews: number;
  quickResponses: number;
  complaints: number;
  lateArrivals: number;
  slowResponses: number;
  rank: number | null;
  freeLeadsAwarded: number;
  weekStartDate: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  redemptionDate: string;
  status: "pending" | "processed" | "delivered";
  deliveryEmail: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: "purchase" | "usage" | "bonus" | "refund";
  amount: number;
  description: string;
  date: string;
  relatedJobId?: string;
  bundleId?: string;
}

export interface CreditBundle {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  popular?: boolean;
}

export interface RewardOption {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  value: string;
  image?: string;
}
