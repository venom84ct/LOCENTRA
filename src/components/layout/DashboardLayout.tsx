import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  MessagesSquare,
  Bell,
  Settings,
  HelpCircle,
  Gift,
  User,
  Award,
  Search,
  LogOut,
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
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Jobs", path: "/dashboard/jobs", icon: Briefcase },
          { name: "Job History", path: "/dashboard/job-history", icon: Briefcase },
          { name: "Messages", path: "/dashboard/messages", icon: MessagesSquare },
          { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
          { name: "Rewards", path: "/dashboard/rewards", icon: Gift },
          { name: "Profile", path: "/dashboard/profile", icon: User },
          { name: "Settings", path: "/dashboard/settings", icon: Settings },
          { name: "Help", path: "/dashboard/help", icon: HelpCircle },
        ]
      : [
          { name: "Dashboard", path: "/dashboard/tradie", icon: LayoutDashboard },
          { name: "Find Jobs", path: "/dashboard/tradie/find-jobs", icon: Search },
          { name: "My Jobs", path: "/dashboard/tradie/my-jobs", icon: Briefcase },
          { name: "Messages", path: "/dashboard/tradie/messages", icon: MessagesSquare },
          { name: "Notifications", path: "/dashboard/tradie/notifications", icon: Bell },
          { name: "Top Tradies", path: "/dashboard/tradie/top-tradies", icon: Award },
          { name: "Profile", path: "/dashboard/tradie/profile", icon: User },
          { name: "Settings", path: "/dashboard/tradie/settings", icon: Settings },
          { name: "Help", path: "/dashboard/tradie/help", icon: HelpCircle },
        ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <div className="mb-6">
          <div className="text-lg font-bold">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.name}>
                <div
                  className={cn(
                    "flex items-center p-2 rounded hover:bg-gray-100",
                    isActive ? "bg-gray-200 font-semibold" : ""
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </div>
              </Link>
            );
          })}
          <Link to="/logout">
            <div className="flex items-center p-2 mt-4 text-red-600 hover:bg-red-50 rounded">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
