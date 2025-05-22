import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import PostJobForm from "@/components/jobs/PostJobForm";
import { toast } from "@/components/ui/use-toast";

const PostJobPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is logged in as homeowner
  useEffect(() => {
    // In a real app, this would check authentication status from a context or store
    // For demo purposes, we'll simulate being logged in
    const isLoggedIn = true; // Simulate logged in
    const userType = "centraResident";

    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "You need to log in as a homeowner to post a job.",
        variant: "destructive",
      });
      navigate("/login", {
        state: {
          message: "Please log in or register as a homeowner to post a job.",
          redirectAfterLogin: "/post-job",
        },
      });
    } else if (isLoggedIn && userType !== "centraResident") {
      toast({
        title: "Access Denied",
        description: "Only Centra Residents can post jobs.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSuccess = () => {
    setIsSubmitting(false);
    toast({
      title: "Job Posted Successfully",
      description: "Your job has been posted and tradies will be notified.",
    });
    navigate("/dashboard/jobs");
  };

  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
          <PostJobForm onSuccess={handleSuccess} />
        </div>
      </div>
    </PublicLayout>
  );
};

export default PostJobPage;
