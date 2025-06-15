import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const StarterSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Adding credits...");

  useEffect(() => {
    const addCredits = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        setMessage("Unable to determine user.");
        return;
      }
      const { error } = await supabase.rpc("increment_credits", {
        user_id: userId,
        amount: 5,
      });
      if (error) {
        setMessage("Failed to add credits.");
      } else {
        setMessage("5 credits added to your account!");
        setTimeout(() => navigate("/dashboard/tradie/wallet"), 3000);
      }
    };
    addCredits();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default StarterSuccess;
