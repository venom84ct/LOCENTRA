import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const RegisterTradie = () => {
  const navigate = useNavigate()
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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const { user } = signUpData
    if (!user) {
      setError("Sign up failed. No user returned.")
      return
    }

    const { error: insertError } = await supabase.from("profile centra resident").insert({
      id: user.id,
      email: formData.email,
      phone: formData.phone,
      first_name: formData.firstName,
      last_name: formData.lastName,
      abn: formData.abn,
      license: formData.license,
      business_name: formData.businessName,
      business_website: formData.businessWebsite,
      created_at: new Date(),
      status: "pending",
    })

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess("✅ Account created! Check your email to confirm.")
    setFormData({
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
    navigate("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Tradie Sign Up</h1>

      {[{ label: "First Name", name: "firstName" },
        { label: "Last Name", name: "lastName" },
        { label: "Email", name: "email", type: "email" },
        { label: "Password", name: "password", type: "password" },
        { label: "Phone", name: "phone" },
        { label: "ABN", name: "abn" },
        { label: "License", name: "license" },
        { label: "Business Name", name: "businessName" },
        { label: "Business Website", name: "businessWebsite" }].map(({ label, name, type = "text" }) => (
        <div key={name}>
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            required={name !== "businessWebsite"}
          />
        </div>
      ))}

      {error && <p className="text-red-600 text-sm">❌ {error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <Button type="submit" className="w-full">Create Tradie Account</Button>
    </form>
  )
}

export default RegisterTradie
