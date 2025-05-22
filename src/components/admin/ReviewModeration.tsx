import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Flag, Star } from "lucide-react";

interface FlaggedReview {
  id: string;
  jobId: string;
  jobTitle: string;
  homeownerId: string;
  homeownerName: string;
  homeownerAvatar: string;
  tradieId: string;
  tradieName: string;
  tradieAvatar: string;
  rating: number;
  comment: string;
  flagReason: string;
  flaggedBy: string;
  flaggedDate: string;
  status: "pending" | "approved" | "removed";
}

const mockFlaggedReviews: FlaggedReview[] = [
  {
    id: "1",
    jobId: "job123",
    jobTitle: "Bathroom Renovation",
    homeownerId: "home1",
    homeownerName: "John Smith",
    homeownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    tradieId: "tradie1",
    tradieName: "Mike Johnson",
    tradieAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    rating: 1,
    comment:
      "Terrible service. Did not complete the job as agreed and left a mess. Would not recommend to anyone!",
    flagReason: "Inappropriate language and false claims",
    flaggedBy: "tradie1",
    flaggedDate: "2023-05-15",
    status: "pending",
  },
  {
    id: "2",
    jobId: "job456",
    jobTitle: "Fence Installation",
    homeownerId: "home2",
    homeownerName: "Sarah Williams",
    homeownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    tradieId: "tradie2",
    tradieName: "David Chen",
    tradieAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 2,
    comment:
      "This tradie is a scammer. Charged me double the agreed price and did half the work. Stay away!",
    flagReason: "Defamatory content",
    flaggedBy: "tradie2",
    flaggedDate: "2023-05-14",
    status: "pending",
  },
  {
    id: "3",
    jobId: "job789",
    jobTitle: "Electrical Rewiring",
    homeownerId: "home3",
    homeownerName: "Emma Johnson",
    homeownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    tradieId: "tradie3",
    tradieName: "Robert Wilson",
    tradieAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    rating: 3,
    comment:
      "Average service at best. Took much longer than promised and the quality is questionable.",
    flagReason: "Factually incorrect",
    flaggedBy: "tradie3",
    flaggedDate: "2023-05-13",
    status: "pending",
  },
];

const ReviewModeration = () => {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "removed"
  >("pending");

  const filteredReviews = mockFlaggedReviews.filter(
    (review) => filter === "all" || review.status === filter,
  );

  const handleApproveReview = (reviewId: string) => {
    // In a real app, this would update the review status in the database
    console.log(`Approving review ${reviewId}`);
  };

  const handleRemoveReview = (reviewId: string) => {
    // In a real app, this would update the review status in the database
    console.log(`Removing review ${reviewId}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flagged Reviews Moderation</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "removed" ? "default" : "outline"}
            onClick={() => setFilter("removed")}
          >
            Removed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{review.jobTitle}</CardTitle>
                  <CardDescription>
                    Flagged on {review.flaggedDate} for "{review.flagReason}"
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    review.status === "approved"
                      ? "default"
                      : review.status === "removed"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {review.status.charAt(0).toUpperCase() +
                    review.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={review.homeownerAvatar}
                        alt={review.homeownerName}
                      />
                      <AvatarFallback>
                        {review.homeownerName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.homeownerName}</p>
                      <p className="text-sm text-muted-foreground">Homeowner</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">"{review.comment}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground mb-1">
                    Homeowner
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={review.homeownerAvatar}
                        alt={review.homeownerName}
                      />
                      <AvatarFallback>
                        {review.homeownerName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p>{review.homeownerName}</p>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground mb-1">Tradie</p>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={review.tradieAvatar}
                        alt={review.tradieName}
                      />
                      <AvatarFallback>
                        {review.tradieName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p>{review.tradieName}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Flag className="h-4 w-4 mr-2 text-amber-500" />
                <p className="text-sm">
                  <span className="font-medium">Flag reason:</span>{" "}
                  {review.flagReason}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                {review.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveReview(review.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Remove Review
                    </Button>
                    <Button onClick={() => handleApproveReview(review.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Review
                    </Button>
                  </>
                )}
                {review.status === "removed" && (
                  <Button onClick={() => handleApproveReview(review.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Restore Review
                  </Button>
                )}
                {review.status === "approved" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveReview(review.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewModeration;
