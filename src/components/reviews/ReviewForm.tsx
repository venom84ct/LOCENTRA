import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { sendPushNotification } from "@/lib/notification";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { containsProfanity } from "@/lib/profanity";

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

    if (containsProfanity(comment)) {
      alert("Profanity is not allowed.");
      setSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to leave a review.");
      setSubmitting(false);
      return;
    }

    // Step 1: Insert review
    const { error: insertError } = await supabase.from("reviews").insert({
      job_id: jobId,
      tradie_id: tradieId,
      homeowner_id: user.id,
      reviewer_name: user.email || "Anonymous",
      comment,
      rating,
    });

    if (insertError) {
      console.error("Review insert error:", insertError);
      alert("Failed to submit review.");
      setSubmitting(false);
      return;
    }

    // Step 2: Recalculate rating stats
    const { data: allReviews, error: fetchError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("tradie_id", tradieId);

    if (!fetchError && allReviews) {
      const ratingCount = allReviews.length;
      const ratingSum = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const ratingAvg = ratingCount > 0 ? ratingSum / ratingCount : 0;

      await supabase
        .from("profile_centra_tradie")
        .update({ rating_avg: ratingAvg, rating_count: ratingCount })
        .eq("id", tradieId);
    }

    // Step 3: Insert notification for tradie
    await supabase.from("notifications").insert({
      recipient_id: tradieId,
      recipient_type: "tradie",
      description: `You received a new ${rating}-star review on: "${jobTitle}".`,
      type: "success",
      related_id: jobId,
      related_type: "job",
    });

    const { data: tradieProfile } = await supabase
      .from("profile_centra_tradie")
      .select("onesignal_player_id")
      .eq("id", tradieId)
      .single();

    const playerId = tradieProfile?.onesignal_player_id as string | null;
    if (playerId) {
      try {
        await sendPushNotification({
          message: `You received a new ${rating}-star review on: "${jobTitle}".`,
          playerId,
        });
      } catch (e) {
        console.error("Failed to send push notification", e);
      }
    }

    setRating(0);
    setComment("");
    setSubmitting(false);
    alert("Review submitted successfully!");
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
      <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
        Submit Review
      </Button>
    </div>
  );
};

export default ReviewForm;
