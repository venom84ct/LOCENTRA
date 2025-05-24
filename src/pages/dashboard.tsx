
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching profile role:", error);
        navigate("/login");
      } else {
        if (data.role === "homeowner") {
          navigate("/dashboard/homeowner");
        } else if (data.role === "tradie") {
          navigate("/dashboard/tradie");
        } else {
          console.warn("Unknown role:", data.role);
          navigate("/login");
        }
      }
    };

    fetchProfileAndRedirect();
  }, [navigate]);

  return <div className="text-center text-xl mt-12">Redirecting based on your role...</div>;
};

export default DashboardPage;
