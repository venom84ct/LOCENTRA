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
} from "lucide-react";

interface JobCardProps {
  job: any;
  onEdit?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle images as array or comma-separated string
  const imageUrls: string[] = Array.isArray(job.image_urls)
    ? job.image_urls
    : typeof job.image_urls === "string"
    ? job.image_urls.split(",").map((s: string) => s.trim())
    : [];

  return (
    <Card className={`bg-white ${job.is_emergency ? "border-4 border-red-600" : "border"}`}>
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
        {/* ✅ Image Grid */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Job image ${idx + 1}`}
                onClick={() => setPreviewUrl(url)}
                className="w-full h-28 object-cover rounded border cursor-pointer hover:scale-105 transition"
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

      {/* 🖼️ Image Zoom Modal */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </Card>
  );
};

export default JobCard;
