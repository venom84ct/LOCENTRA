import React from "react";

interface Job {
  title: string;
}

interface TradieProfile {
  name?: string;
  email?: string;
  avatar?: string;
  trade?: string;
  license?: string;
  abn?: string;
  address?: string;
  phone?: string;
  memberSince?: string;
  credits?: number;
  rewardPoints?: number;
  rating?: number;
  reviewCount?: number;
  verificationStatus?: string;
  previousJobs?: Job[];
}

const TradieDashboard = ({ profile }: { profile: TradieProfile }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {profile?.name || "Tradie"}</h1>
      {profile?.previousJobs?.length ? (
        profile.previousJobs.map((job, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            {job.title}
          </div>
        ))
      ) : (
        <p>No previous jobs found.</p>
      )}
    </div>
  );
};

export default TradieDashboard;

