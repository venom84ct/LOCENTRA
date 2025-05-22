import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <div className="max-w-md mx-auto">
          <RegisterForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
