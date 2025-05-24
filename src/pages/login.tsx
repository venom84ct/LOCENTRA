import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data?.session) {
      setError(signInError?.message || "Login failed");
      return;
    }

    const { user } = data.session;
    const { data: profile, error: profileError } = await supabase
      .from("profile_centra_resident")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setError("Could not find user role");
      return;
    }

    const role = profile.role;
    localStorage.setItem("userType", role);
    localStorage.setItem("isLoggedIn", "true");

    if (role === "tradie") {
      navigate("/dashboard/tradie");
    } else if (role === "homeowner") {
      navigate("/dashboard/homeowner");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">❌ {error}</p>}

        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
