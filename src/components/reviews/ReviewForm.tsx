// src/components/reviews/ReviewForm.tsx
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
    if (!user) return;

    const { error } = await supabase.from("reviews").insert({
      job_id: jobId,
      tradie_id: tradieId,
      reviewer_id: user.id,
      reviewer_name: user.email || "Anonymous",
      comment,
      rating,
    });

    setSubmitting(false);
    if (error) alert("Failed to submit review");
    else {
      setRating(0);
      setComment("");
      alert("Review submitted successfully");
    }
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
