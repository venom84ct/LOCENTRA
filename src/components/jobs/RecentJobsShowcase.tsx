import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";

interface Job {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  budget: string | null;
  created_at: string;
  is_emergency: boolean | null;
}

const RecentJobsShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, category, location, budget, created_at, is_emergency, assigned_tradie"
        )
        .or("status.eq.open,status.eq.available")
        .is("assigned_tradie", null)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error) setJobs(data || []);
    };

    fetchJobs();
  }, []);

  // Get 3 jobs to display based on current index
  const getVisibleJobs = () => {
    if (jobs.length === 0) return [];
    const visible: Job[] = [];
    const count = Math.min(3, jobs.length);
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % jobs.length;
      visible.push(jobs[index]);
    }
    return visible;
  };

  // Auto-rotate jobs every 5 seconds
  useEffect(() => {
    if (jobs.length < 2) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jobs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {getVisibleJobs().map((job) => (
          <Card
            key={job.id}
            className="bg-white border-2 border-gray-100 transition-all duration-500 hover:shadow-lg"
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{job.title}</h3>
                {job.is_emergency && (
                  <Badge variant="destructive">Emergency</Badge>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{job.category}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{job.budget}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {formatDistanceToNow(new Date(job.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link to="/login?redirect=dashboard/find-jobs">
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {jobs.slice(0, Math.max(1, jobs.length - 2)).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-red-600" : "bg-gray-300"
            }`}
            aria-label={`Show jobs starting from position ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentJobsShowcase;
