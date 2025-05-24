
import { Routes, Route } from "react-router-dom"
import DashboardRedirect from "@/components/DashboardRedirect"
import TradieDashboard from "@/pages/dashboard/tradie"
import HomeownerDashboard from "@/pages/dashboard/homeowner"

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardRedirect />} />
      <Route path="tradie" element={<TradieDashboard />} />
      <Route path="homeowner" element={<HomeownerDashboard />} />
    </Routes>
  )
}

export default DashboardRoutes

