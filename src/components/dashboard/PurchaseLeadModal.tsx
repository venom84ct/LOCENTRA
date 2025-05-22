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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, DollarSign, AlertCircle } from "lucide-react";

interface PurchaseLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onPurchase: () => void;
  availableCredits: number;
}

const PurchaseLeadModal: React.FC<PurchaseLeadModalProps> = ({
  isOpen,
  onClose,
  job,
  onPurchase,
  availableCredits,
}) => {
  if (!job) return null;

  const leadCost = job.emergency ? 10 : 5;
  const canPurchase = availableCredits >= leadCost;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Lead</DialogTitle>
          <DialogDescription>
            Review job details before purchasing this lead
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
            <p className="text-sm mb-2">{job.description}</p>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={job.homeowner?.avatar} alt="Homeowner" />
                  <AvatarFallback>
                    {job.homeowner?.name?.substring(0, 2) || "HO"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {job.homeowner?.name || "Homeowner"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Member since {job.homeowner?.memberSince || "2023"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Lead Purchase Cost: {leadCost} credits
                </p>
                <p className="text-xs text-amber-700">
                  Your available balance: {availableCredits} credits
                </p>
                {!canPurchase && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    You don't have enough credits to purchase this lead.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {!canPurchase && (
              <Button variant="default" asChild>
                <a href="/dashboard/wallet">Buy Credits</a>
              </Button>
            )}
            <Button
              variant={canPurchase ? "default" : "outline"}
              onClick={onPurchase}
              disabled={!canPurchase}
            >
              {canPurchase
                ? `Purchase Lead (${leadCost} credits)`
                : "Not Enough Credits"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseLeadModal;
