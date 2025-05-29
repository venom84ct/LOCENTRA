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

const TradieDashboard = ({ user }: { user: TradieProfile }) => {
  if (!user) return <div className="p-4 text-red-600">User not loaded.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      {user.previousJobs?.length ? (
        <div>
          <h2 className="text-lg font-semibold">Previous Jobs:</h2>
          <ul className="list-disc list-inside">
            {user.previousJobs.map((job, index) => (
              <li key={index}>{job.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No previous jobs listed.</p>
      )}
    </div>
  );
};

export default TradieDashboard;
