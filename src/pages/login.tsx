import React from "react";
import { useLocation } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const location = useLocation();
  const message = location.state?.message || "";
  const redirectAfterLogin = location.state?.redirectAfterLogin || "/dashboard";

  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <div className="max-w-md mx-auto">
          {message && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              {message}
            </div>
          )}
          <LoginForm redirectPath={redirectAfterLogin} />
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
