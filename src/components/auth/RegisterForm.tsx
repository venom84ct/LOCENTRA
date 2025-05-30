import React, { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { signUp } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"

const RegisterForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialUserType =
    (searchParams.get("type") as "homeowner" | "tradie") || "homeowner"

  const [userType, setUserType] = useState<"homeowner" | "tradie">(initialUserType)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const { data, error } = await signUp(formData.email, formData.password)

    if (error || !data.user) {
      alert(error?.message || "Failed to register")
      return
    }

    const { error: profileError } = await supabase
      .from("profile_centra_resident")
      .insert([
        {
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          user_type: userType,
          created_at: new Date().toISOString(),
        },
      ])

    if (profileError) {
      alert(profileError.message)
    } else {
      alert("✅ Account created. Check your email to confirm.")
      navigate("/login")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
          Create your {userType === "homeowner" ? "Homeowner" : "Tradie"} account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={initialUserType}
          value={userType}
          onValueChange={(value) =>
            setUserType(value as "homeowner" | "tradie")
          }
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="homeowner">Homeowner</TabsTrigger>
            <TabsTrigger value="tradie">Tradie</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, agreeTerms: checked as boolean })
              }
              required
            />
            <label
              htmlFor="agreeTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <a href="/terms" className="text-primary hover:underline">terms of service</a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">privacy policy</a>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={!formData.agreeTerms}>
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">Log in</a>
        </div>
      </CardFooter>
    </Card>
  )
}

export default RegisterForm
