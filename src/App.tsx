import React from "react"
import { Routes, Route } from "react-router-dom"
import ProfileInitializer from "@/components/ProfileInitializer"
import HomePage from "@/pages/index"       // ✅ Your real homepage
import LoginPage from "@/pages/login"
import RegisterPage from "@/pages/register"
import Dashboard from "@/pages/dashboard"

const App = () => {
  return (
    <>
      <ProfileInitializer />
      <Routes>
        <Route path="/" element={<HomePage />} />            {/* ✅ Fixed */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
