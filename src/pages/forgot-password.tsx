import React, { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Password reset email sent to", email);
      setMessage("Check your email for the reset link.");
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">❌ {error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
