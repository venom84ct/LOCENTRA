import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProfileInitializer from "@/components/ProfileInitializer";
import PublicLayout from "@/components/layout/PublicLayout";

// Pages
import HomePage from "@/components/home"; // ✅ Your original homepage
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Pricing from "@/pages/pricing";
import HowItWorks from "@/pages/how-it-works";

const App = () => {
  return (
    <BrowserRouter>
      <ProfileInitializer />
      <Routes>
        {/* Public Pages with Layout */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PublicLayout>
              <HowItWorks />
            </PublicLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicLayout>
              <Pricing />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

