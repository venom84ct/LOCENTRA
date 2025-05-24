import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const RegisterPage = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState("homeowner")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    firstName: "",
    lastName: "",
    abn: "",
    license: "",
    businessName: "",
    businessWebsite: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const { email, password } = formData
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error: insertError } = await supabase.from("profile_centra_resident").insert({
        id: user.id,
        email: formData.email,
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        abn: formData.abn,
        license: formData.license,
        business_name: formData.businessName,
        business_website: formData.businessWebsite,
        role,
        status: "pending",
        created_at: new Date(),
      })

      if (insertError) {
        setError("Profile creation failed: " + insertError.message)
        return
      }
    }

    setSuccess("✅ Account created! Please confirm your email before logging in.")
    setTimeout(() => navigate("/login"), 3000)
  }

  const commonFields = (
    <>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>
    </>
  )

  const tradieFields = (
    <>
      <div>
        <Label htmlFor="abn">ABN</Label>
        <Input id="abn" name="abn" value={formData.abn} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="license">License</Label>
        <Input id="license" name="license" value={formData.license} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="businessWebsite">Business Website</Label>
        <Input id="businessWebsite" name="businessWebsite" value={formData.businessWebsite} onChange={handleChange} />
      </div>
    </>
  )

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <Tabs value={role} onValueChange={setRole} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="homeowner">Homeowner</TabsTrigger>
          <TabsTrigger value="tradie">Tradie</TabsTrigger>
        </TabsList>
        <TabsContent value="homeowner">
          <form onSubmit={handleSubmit} className="space-y-4">
            {commonFields}
            {error && <p className="text-red-600 text-sm">❌ {error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button type="submit" className="w-full">Create Homeowner Account</Button>
          </form>
        </TabsContent>
        <TabsContent value="tradie">
          <form onSubmit={handleSubmit} className="space-y-4">
            {commonFields}
            {tradieFields}
            {error && <p className="text-red-600 text-sm">❌ {error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button type="submit" className="w-full">Create Tradie Account</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RegisterPage
