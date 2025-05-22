import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: string;
  date: string;
  emergency: boolean;
}

const RecentJobsShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allJobs: Job[] = [
    {
      id: "job1",
      title: "Kitchen Sink Replacement",
      category: "Plumbing",
      location: "Sydney, NSW",
      budget: "$300 - $500",
      date: "2 hours ago",
      emergency: false,
    },
    {
      id: "job2",
      title: "Emergency Hot Water System Repair",
      category: "Plumbing",
      location: "Melbourne, VIC",
      budget: "$200 - $400",
      date: "5 hours ago",
      emergency: true,
    },
    {
      id: "job3",
      title: "Bathroom Renovation",
      category: "Renovation",
      location: "Brisbane, QLD",
      budget: "$5,000 - $8,000",
      date: "1 day ago",
      emergency: false,
    },
    {
      id: "job4",
      title: "Electrical Wiring Inspection",
      category: "Electrical",
      location: "Perth, WA",
      budget: "$150 - $300",
      date: "3 hours ago",
      emergency: false,
    },
    {
      id: "job5",
      title: "Roof Leak Repair",
      category: "Roofing",
      location: "Adelaide, SA",
      budget: "$400 - $800",
      date: "6 hours ago",
      emergency: true,
    },
    {
      id: "job6",
      title: "Garden Landscaping",
      category: "Landscaping",
      location: "Hobart, TAS",
      budget: "$2,000 - $4,000",
      date: "1 day ago",
      emergency: false,
    },
  ];

  // Get 3 jobs to display based on current index
  const getVisibleJobs = () => {
    const jobs = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % allJobs.length;
      jobs.push(allJobs[index]);
    }
    return jobs;
  };

  // Auto-rotate jobs every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allJobs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allJobs.length]);

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
                {job.emergency && (
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
                  <span className="text-gray-600">{job.date}</span>
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
        {allJobs.slice(0, allJobs.length - 2).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-red-600" : "bg-gray-300"}`}
            aria-label={`Show jobs starting from position ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentJobsShowcase;
