import React from "react";
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
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Pencil,
} from "lucide-react";

interface JobCardProps {
  job: any;
  onEdit?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  // ✅ Safely parse image_urls whether it's an array or a string
  let imageUrls: string[] = [];

  try {
    if (Array.isArray(job.image_urls)) {
      imageUrls = job.image_urls;
    } else if (typeof job.image_urls === "string") {
      const parsed = JSON.parse(job.image_urls);
      if (Array.isArray(parsed)) {
        imageUrls = parsed;
      }
    }
  } catch (e) {
    console.warn("Could not parse image_urls:", e);
  }

  return (
    <Card
      className={`bg-white ${job.is_emergency ? "border-4 border-red-600" : "border"}`}
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
          <Badge variant="secondary" className="capitalize">
            {job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* ✅ Display images in a responsive grid */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Job image ${idx + 1}`}
                className="w-full h-28 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <p className="text-sm mb-4">{job.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
              {job.location}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date Posted</p>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
              {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
              {job.budget}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="capitalize">{job.status}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(job.id)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
