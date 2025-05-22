import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "";
  const searchParams = new URLSearchParams(location.search);
  const redirectAfterLogin = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate(redirectAfterLogin);
    }
  }, [navigate, redirectAfterLogin]);

  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <div className="max-w-md mx-auto">
          {message && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              {message}
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
