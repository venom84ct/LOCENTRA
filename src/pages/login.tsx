import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import PublicLayout from "@/components/layout/PublicLayout"

const LoginPage = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<"homeowner" | "tradie">("homeowner")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !data?.session) {
      setError(signInError?.message || "Login failed")
      return
    }

    const { user } = data.session

    // Check if user is tradie
    const { data: tradieProfile } = await supabase
      .from("profile_centra_tradie")
      .select("id")
      .eq("id", user.id)
      .single()

    if (tradieProfile) {
      localStorage.setItem("userType", "tradie")
      localStorage.setItem("isLoggedIn", "true")
      navigate("/dashboard")
      return
    }

    // Check if user is homeowner
    const { data: residentProfile } = await supabase
      .from("profile_centra_resident")
      .select("id")
      .eq("id", user.id)
      .single()

    if (residentProfile) {
      localStorage.setItem("userType", "homeowner")
      localStorage.setItem("isLoggedIn", "true")
      navigate("/dashboard")
      return
    }

    setError("User profile not found.")
  }

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>

        <Tabs value={userType} onValueChange={(v) => setUserType(v as "homeowner" | "tradie")} className="mb-4">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="homeowner">Homeowner</TabsTrigger>
            <TabsTrigger value="tradie">Tradie</TabsTrigger>
          </TabsList>

          <TabsContent value="homeowner">
            <form onSubmit={handleLogin} className="space-y-4">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && <p className="text-red-600 text-sm">❌ {error}</p>}
              <Button type="submit" className="w-full">Log In</Button>
            </form>
          </TabsContent>

          <TabsContent value="tradie">
            <form onSubmit={handleLogin} className="space-y-4">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && <p className="text-red-600 text-sm">❌ {error}</p>}
              <Button type="submit" className="w-full">Log In</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  )
}

export default LoginPage
