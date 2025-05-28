import React from "react";

interface Job {
  title: string;
}

interface TradieProfile {
  name: string;
  email: string;
  avatar: string;
  trade: string;
  license: string;
  abn: string;
  address: string;
  phone: string;
  memberSince: string;
  credits: number;
  rewardPoints: number;
  rating: number;
  reviewCount: number;
  verificationStatus: string;
  previousJobs?: Job[];
}

const TradieDashboard = ({ profile }: { profile: TradieProfile }) => {
  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      {profile.previousJobs?.map((job, index) => (
        <div key={index}>{job.title}</div>
      ))}
    </div>
  );
};

export default TradieDashboard;
