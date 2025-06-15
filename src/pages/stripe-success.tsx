import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const StripeSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const addCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("error");
        return;
      }
      const { error } = await supabase.rpc("increment_credits", {
        user_id: user.id,
        amount: 10,
      });
      if (error) {
        console.error("Failed to add credits:", error);
        setStatus("error");
        return;
      }
      setStatus("success");
    };
    addCredits();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col space-y-4">
      {status === "processing" && <p>Processing your purchase...</p>}
      {status === "success" && <>
        <p>Credits added to your account!</p>
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={() => navigate("/dashboard/tradie/wallet")}>Go to Wallet</button>
      </>}
      {status === "error" && <>
        <p>There was an issue updating your credits.</p>
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={() => navigate("/dashboard/tradie/wallet")}>Back</button>
      </>}
    </div>
  );
};

export default StripeSuccess;
