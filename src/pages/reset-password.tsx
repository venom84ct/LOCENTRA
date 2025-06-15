import React, { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      console.log("Password updated");
      setSuccess("Password updated successfully. You can now log in.");
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">❌ {error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default ResetPasswordPage;
