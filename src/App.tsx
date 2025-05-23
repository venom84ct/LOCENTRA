import React from "react"
import { Routes, Route } from "react-router-dom"
import ProfileInitializer from "@/components/ProfileInitializer"
import HomePage from "@/components/home" // ✅ Corrected path
import LoginPage from "@/pages/login"
import RegisterPage from "@/pages/register"
import Dashboard from "@/pages/dashboard"

const App = () => {
  return (
    <>
      <ProfileInitializer />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* ✅ Original homepage restored */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
