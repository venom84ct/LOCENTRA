import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, XCircle, CheckCircle } from "lucide-react";

interface JobCardProps {
  job: any;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onCancel, onComplete }) => {
  const renderStatus = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card
      className={`relative ${
        job.is_emergency
          ? "border-2 border-red-600 shadow-lg"
          : "border border-gray-200"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>{job.category}</CardDescription>
          </div>
          {renderStatus(job.status)}
        </div>
        {job.is_emergency && (
          <Badge
            variant="destructive"
            className="absolute top-4 right-4 text-xs bg-red-600"
          >
            Emergency
          </Badge>
        )}
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

        {job.image_urls?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {job.image_urls.map((url: string, i: number) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
              >
                <img
                  src={url}
                  alt={`Job Image ${i + 1}`}
                  className="rounded object-cover h-32 w-full hover:opacity-90 transition"
                />
              </a>
            ))}
          </div>
        )}

        {job.status === "open" && (
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="destructive"
              onClick={() => onCancel(job.id)}
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel Job
            </Button>
            <Button
              variant="outline"
              onClick={() => onComplete(job.id)}
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark as Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
