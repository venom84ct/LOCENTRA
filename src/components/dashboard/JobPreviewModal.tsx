import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Lock } from "lucide-react";

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onPurchase: () => void;
}

const JobPreviewModal: React.FC<JobPreviewModalProps> = ({
  isOpen,
  onClose,
  job,
  onPurchase,
}) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Job Preview</DialogTitle>
          <DialogDescription>
            Preview job details before purchasing the lead
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{job.title}</h3>
            {job.emergency && <Badge variant="destructive">Emergency</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{job.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{job.date}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{job.budget}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm mb-2">
              {job.description.substring(0, 100)}...
            </p>
            <div className="bg-muted p-3 rounded-md mt-2">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Purchase this lead to view full details and contact the
                  homeowner
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Lead cost: </span>
              {job.emergency ? 10 : 5} credits
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onPurchase}>Purchase Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobPreviewModal;
