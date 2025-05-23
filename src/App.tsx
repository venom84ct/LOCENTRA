import React from "react"
import { Routes, Route } from "react-router-dom"
import ProfileInitializer from "@/components/ProfileInitializer"
import Home from "@/pages/home"  // ✅ This is your original homepage
import LoginPage from "@/pages/login"
import RegisterPage from "@/pages/register"
import Dashboard from "@/pages/dashboard"

const App = () => {
  return (
    <>
      <ProfileInitializer />
      <Routes>
        <Route path="/" element={<Home />} />                 {/* ✅ show original home */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
