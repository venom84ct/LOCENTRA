// --- ReviewForm.tsx ---
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ReviewFormProps {
  jobId: string;
  tradieId: string;
  jobTitle: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ jobId, tradieId, jobTitle }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to leave a review.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      job_id: jobId,
      tradie_id: tradieId,
      homeowner_id: user.id,
      reviewer_name: user.email || "Anonymous",
      comment,
      rating,
      created_at: new Date().toISOString(),
    });

    if (!error) {
      await supabase.from("jobs").update({ reviewed: true }).eq("id", jobId);
      setRating(0);
      setComment("");
      alert("Review submitted successfully");
    } else {
      console.error(error);
      alert("Failed to submit review");
    }

    setSubmitting(false);
  };

  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">Leave a review for: {jobTitle}</h3>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <Star
            key={val}
            className={`w-5 h-5 cursor-pointer ${rating >= val ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(val)}
          />
        ))}
      </div>
      <Textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={submitting || rating === 0 || !comment.trim()}>
        Submit Review
      </Button>
    </div>
  );
};

export default ReviewForm;

// --- DashboardJobs.tsx (Excerpt for Review Button) ---
{isCompleted && !job.reviewed && (
  <div className="mt-3">
    <Button
      variant="default"
      onClick={() => goToReviewPage(job.id)}
    >
      <Star className="w-4 h-4 mr-2" />
      Leave a Review
    </Button>
  </div>
)}

// --- TradieProfilePage.tsx (Review Section Avg Calculation) ---
const avgRating = profile.reviews.length > 0
  ? profile.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / profile.reviews.length
  : 0;

<div className="flex items-center justify-center mt-2 text-yellow-500">
  <Star className="w-4 h-4 mr-1" />
  {avgRating.toFixed(1)} ({profile.reviews.length} reviews)
</div>


