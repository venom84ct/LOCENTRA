
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/dashboard/tradie", icon: <Home className="w-4 h-4 mr-2" />, label: "Dashboard" },
  { to: "/dashboard/tradie/my-jobs", icon: <Briefcase className="w-4 h-4 mr-2" />, label: "My Jobs" },
  { to: "/dashboard/tradie/tradie-messages", icon: <MessageSquare className="w-4 h-4 mr-2" />, label: "Messages" },
  { to: "/dashboard/tradie/notifications", icon: <Bell className="w-4 h-4 mr-2" />, label: "Notifications" },
  { to: "/dashboard/tradie/profile", icon: <User className="w-4 h-4 mr-2" />, label: "Profile" },
  { to: "/dashboard/tradie/settings", icon: <Settings className="w-4 h-4 mr-2" />, label: "Settings" },
  { to: "/dashboard/tradie/help", icon: <HelpCircle className="w-4 h-4 mr-2" />, label: "Help" },
  { to: "/dashboard/tradie/top-tradies", icon: <Users className="w-4 h-4 mr-2" />, label: "Top Tradies" },
];

const TradieSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === item.to ? "bg-gray-100 text-primary" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default TradieSidebar;
