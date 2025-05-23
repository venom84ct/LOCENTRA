import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"

const LoginForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error, data } = await signIn(email, password)

    if (error || !data.session) {
      setError("Invalid credentials")
      return
    }

    const userId = data.session.user.id

    const { data: profile, error: profileError } = await supabase
      .from("profile centra resident")
      .select("user_type")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      setError("Could not find user role")
      return
    }

    if (profile.user_type === "tradie") {
      navigate("/dashboard/tradie")
    } else if (profile.user_type === "homeowner") {
      navigate("/dashboard/homeowner")
    } else {
      setError("Unknown user role")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full">
        Log In
      </Button>

      <div className="text-center text-sm mt-4">
        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
      </div>
    </form>
  )
}

export default LoginForm

