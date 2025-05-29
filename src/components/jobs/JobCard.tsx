// src/components/jobs/JobCard.tsx
import React, { useState } from "react";
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
  X,
} from "lucide-react";

interface JobCardProps {
  job: any;
  onEdit?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <>
      <Card
        className={`bg-white ${
          job.is_emergency ? "border-4 border-red-600" : "border"
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
            <Badge variant="secondary" className="capitalize">
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* ✅ Image Grid with Click to Zoom */}
          {job.image_urls &&
            Array.isArray(job.image_urls) &&
            job.image_urls.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2">
                {job.image_urls.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Job image ${idx + 1}`}
                    onClick={() => setPreviewUrl(url)}
                    className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80 transition"
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
            <Button variant="outline" size="sm" onClick={() => onEdit?.(job.id)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Image Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
