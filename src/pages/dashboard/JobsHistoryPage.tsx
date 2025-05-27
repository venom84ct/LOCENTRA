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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Clock, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobsHistoryPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;

      setUser(user);

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (!error) setJobs(data || []);
      setLoading(false);
    };

    fetchCompletedJobs();
  }, []);

  return (
    <DashboardLayout userType="centraResident" user={{ email: user?.email }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Jobs History</h1>

        {loading ? (
          <p>Loading completed jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">No completed jobs yet.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.category}</CardDescription>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-gray-600">{job.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.budget}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit-job/${job.id}`)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobsHistoryPage;
