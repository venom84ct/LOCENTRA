import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProfileInitializer from "@/components/ProfileInitializer"
import Dashboard from "@/pages/dashboard"
import LoginPage from "@/pages/login"
import RegisterPage from "@/pages/register"

const App = () => {
  return (
    <Router>
      <ProfileInitializer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        {/* Add fallback or 404 route if needed */}
      </Routes>
    </Router>
  )
}

export default App
