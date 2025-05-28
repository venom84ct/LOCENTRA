import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  LogOut,
  MessagesSquare,
  Bell,
  Settings,
  HelpCircle,
  Gift,
  Briefcase,
  LayoutDashboard,
  Award,
} from "lucide-react";

interface DashboardLayoutProps {
  userType: "centraResident" | "tradie";
  user: any;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userType,
  user,
  children,
}) => {
  const location = useLocation();

  const navItems =
    userType === "centraResident"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
          { name: "Jobs", path: "/dashboard/jobs", icon: <Briefcase className="h-5 w-5 mr-2" /> },
          { name: "Job History", path: "/dashboard/job-history", icon: <Briefcase className="h-5 w-5 mr-2" /> },
          { name: "Messages", path: "/dashboard/messages", icon: <MessagesSquare className="h-5 w-5 mr-2" /> },
          { name: "Notifications", path: "/dashboard/notifications", icon: <Bell className="h-5 w-5 mr-2" /> },
          { name: "Rewards", path: "/dashboard/rewards", icon: <Gift className="h-5 w-5 mr-2" /> },
          { name: "Profile", path: "/dashboard/profile", icon: <User className="h-5 w-5 mr-2" /> },
          { name: "Settings", path: "/dashboard/settings", icon: <Settings className="h-5 w-5 mr-2" /> },
          { name: "Help", path: "/dashboard/help", icon: <HelpCircle className="h-5 w-5 mr-2" /> },
        ]
      : [
          { name: "Dashboard", path: "/dashboard/tradie", icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
          { name: "Find Jobs", path: "/dashboard/tradie/find-jobs", icon: <Briefcase className="h-5 w-5 mr-2" /> },
          { name: "My Jobs", path: "/dashboard/tradie/my-jobs", icon: <Briefcase className="h-5 w-5 mr-2" /> },
          { name: "Messages", path: "/dashboard/tradie/messages", icon: <MessagesSquare className="h-5 w-5 mr-2" /> },
          { name: "Notifications", path: "/dashboard/tradie/notifications", icon: <Bell className="h-5 w-5 mr-2" /> },
          { name: "Top Tradies", path: "/dashboard/tradie/top-tradies", icon: <Award className="h-5 w-5 mr-2" /> },
          { name: "Profile", path: "/dashboard/tradie/profile", icon: <User className="h-5 w-5 mr-2" /> },
          { name: "Settings", path: "/dashboard/tradie/settings", icon: <Settings className="h-5 w-5 mr-2" /> },
          { name: "Help", path: "/dashboard/tradie/help", icon: <HelpCircle className="h-5 w-5 mr-2" /> },
        ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <div className="mb-6">
          <div className="text-lg font-bold">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center p-2 rounded hover:bg-gray-100",
                  location.pathname === item.path ? "bg-gray-200 font-semibold" : ""
                )}
              >
                {item.icon}
                {item.name}
              </div>
            </Link>
          ))}
          <Link to="/logout">
            <div className="flex items-center p-2 mt-4 text-red-600 hover:bg-red-50 rounded">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
