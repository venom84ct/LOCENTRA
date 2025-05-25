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
import { Gift, Award, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomeownerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return navigate("/login");

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      if (error) {
        console.error("Failed to load profile:", error);
      } else {
        setUser(data);
      }

      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user.first_name}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Reward Points</CardTitle>
              <CardDescription>
                Earned by completing jobs and referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{user.reward_points ?? 0}</div>
              <Gift className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs Completed</CardTitle>
              <CardDescription>
                Total completed home service requests
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{user.jobs_completed ?? 0}</div>
              <Award className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Since</CardTitle>
              <CardDescription>Your join date</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-lg">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Quick actions to get you started</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <Button onClick={() => navigate("/post-job")}>Post a New Job</Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/jobs")}>
              View My Jobs
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard/rewards")}>
              Redeem Points
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HomeownerDashboard;
