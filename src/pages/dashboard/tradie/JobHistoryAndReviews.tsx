import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function JobHistoryAndReviews() {
  const [jobs, setJobs] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("tradie_id", user.id)
        .order("created_at", { ascending: false })

      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .eq("tradie_id", user.id)
        .order("created_at", { ascending: false })

      if (!jobError) setJobs(jobData || [])
      if (!reviewError) setReviews(reviewData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading job history...</p>

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">Job History</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded bg-white">
              <p><strong>Title:</strong> {job.job_title}</p>
              <p><strong>Client:</strong> {job.homeowner_name}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p className="text-sm text-gray-500">{new Date(job.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-bold mt-10 mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border p-4 rounded bg-white">
              <p><strong>From:</strong> {review.reviewer_name}</p>
              <p><strong>Rating:</strong> {"⭐".repeat(review.rating)}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
              <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
