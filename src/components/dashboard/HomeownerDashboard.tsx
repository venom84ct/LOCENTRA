import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomeownerDashboard = () => {
  const [realJobs, setRealJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setRealJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Button asChild>
          <Link to="/post-job">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : realJobs.length === 0 ? (
        <p className="text-gray-600">No jobs posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {realJobs.map((job) => (
            <Card
              key={job.id}
              className={`bg-white ${
                job.is_emergency ? "border-4 border-red-600" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {job.is_emergency && (
                        <Badge variant="destructive" className="ml-2">
                          Emergency
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{job.category}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="self-start capitalize">
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{job.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-sm">{job.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date Posted</p>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-sm">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-sm">{job.budget}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-sm capitalize">{job.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeownerDashboard;
