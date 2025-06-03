import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load core pages
const Dashboard = lazy(() => import("./pages/dashboard"));
const AdminPage = lazy(() => import("./pages/admin"));
const HowItWorks = lazy(() => import("./pages/how-it-works"));
const Pricing = lazy(() => import("./pages/pricing"));
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));

// Dashboard-only pages
const DashboardPostJob = lazy(() => import("./pages/dashboard/post-job"));
const DashboardJobs = lazy(() => import("./pages/dashboard/jobs"));
const DashboardJobHistory = lazy(() => import("./pages/dashboard/JobsHistoryPage"));
const DashboardEditJob = lazy(() => import("./pages/dashboard/EditJobPage"));
const DashboardMessages = lazy(() => import("./pages/dashboard/messages"));
const DashboardNotifications = lazy(() => import("./pages/dashboard/notifications"));
const DashboardRewards = lazy(() => import("./pages/dashboard/rewards"));
const DashboardProfile = lazy(() => import("./pages/dashboard/profile"));
const DashboardSettings = lazy(() => import("./pages/dashboard/settings"));
const DashboardHelp = lazy(() => import("./pages/dashboard/help"));
const DashboardWallet = lazy(() => import("./pages/dashboard/wallet"));
const DashboardFindJobs = lazy(() => import("./pages/dashboard/find-jobs"));
const DashboardFindTradie = lazy(() => import("./pages/dashboard/find-tradie"));
const DashboardReview = lazy(() => import("./pages/dashboard/review/[jobId]")); // ✅ Dynamic review page

// Tradie dashboard pages
const TradieMessages = lazy(() => import("./pages/dashboard/tradie/messages"));
const TradieNotifications = lazy(() => import("./pages/dashboard/tradie/notifications"));
const TradieProfile = lazy(() => import("./pages/dashboard/tradie/profile"));
const TradieSettings = lazy(() => import("./pages/dashboard/tradie/settings"));
const TradieHelp = lazy(() => import("./pages/dashboard/tradie/help"));
const TradieTopTradies = lazy(() => import("./pages/dashboard/tradie/top-tradies"));
const TradieMyJobs = lazy(() => import("./pages/dashboard/tradie/my-jobs"));
const TradieFindJobs = lazy(() => import("./pages/dashboard/tradie/find-jobs"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Homepages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/tradie" element={<Dashboard />} />

        {/* Homeowner dashboard routes */}
        <Route path="/dashboard/jobs" element={<DashboardJobs />} />
        <Route path="/dashboard/job-history" element={<DashboardJobHistory />} />
        <Route path="/dashboard/edit-job/:id" element={<DashboardEditJob />} />
        <Route path="/dashboard/messages" element={<DashboardMessages />} />
        <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
        <Route path="/dashboard/rewards" element={<DashboardRewards />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/settings" element={<DashboardSettings />} />
        <Route path="/dashboard/help" element={<DashboardHelp />} />
        <Route path="/dashboard/wallet" element={<DashboardWallet />} />
        <Route path="/dashboard/find-jobs" element={<DashboardFindJobs />} />
        <Route path="/dashboard/find-tradie" element={<DashboardFindTradie />} />
        <Route path="/dashboard/post-job" element={<DashboardPostJob />} />
        <Route path="/dashboard/review/:jobId" element={<DashboardReview />} /> {/* ✅ Add dynamic review route */}

        {/* Tradie dashboard routes */}
        <Route path="/dashboard/tradie/messages" element={<TradieMessages />} />
        <Route path="/dashboard/tradie/notifications" element={<TradieNotifications />} />
        <Route path="/dashboard/tradie/profile" element={<TradieProfile />} />
        <Route path="/dashboard/tradie/settings" element={<TradieSettings />} />
        <Route path="/dashboard/tradie/help" element={<TradieHelp />} />
        <Route path="/dashboard/tradie/top-tradies" element={<TradieTopTradies />} />
        <Route path="/dashboard/tradie/my-jobs" element={<TradieMyJobs />} />
        <Route path="/dashboard/tradie/find-jobs" element={<TradieFindJobs />} />

        {/* Tempo route if enabled */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<></>} />
        )}
      </Routes>

      {/* Optional tempo route injection */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
