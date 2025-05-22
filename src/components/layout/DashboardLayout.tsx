import React, { useState } from "react";
import Logo from "@/components/ui/logo";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  CreditCard,
  HelpCircle,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "centraResident" | "tradie";
  user: {
    name: string;
    email?: string;
    avatar: string;
    unreadMessages?: number;
    unreadNotifications?: number;
  };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userType,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isHomeUser = userType === "centraResident" || userType === "homeowner";

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log("Logging out");
    navigate("/");
  };

  // Create separate navigation items for each user type to prevent switching
  const homeUserNavItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "My Jobs",
      path: "/dashboard/jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Messages",
      path: "/dashboard/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: user.unreadMessages,
    },
    {
      name: "Notifications",
      path: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: user.unreadNotifications,
    },
    {
      name: "Rewards",
      path: "/dashboard/rewards",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Help",
      path: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const tradieNavItems = [
    {
      name: "Dashboard",
      path: "/dashboard/tradie",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Find Jobs",
      path: "/dashboard/find-jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "My Jobs",
      path: "/dashboard/tradie/my-jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Messages",
      path: "/dashboard/tradie/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: user.unreadMessages,
    },
    {
      name: "Notifications",
      path: "/dashboard/tradie/notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: user.unreadNotifications,
    },
    {
      name: "Wallet",
      path: "/dashboard/wallet",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/dashboard/tradie/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Top Tradies",
      path: "/dashboard/tradie/top-tradies",
      icon: <Award className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/dashboard/tradie/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Help",
      path: "/dashboard/tradie/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  // Select the appropriate navigation items based on user type
  const navItems = isHomeUser ? homeUserNavItems : tradieNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-6">
              <Logo size="md" variant="full" />
            </Link>
            <h1 className="text-xl font-bold text-red-600 hidden md:block">
              {isHomeUser ? "Centra Resident" : "Tradie"} Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  to={
                    isHomeUser
                      ? "/dashboard/messages"
                      : "/dashboard/tradie/messages"
                  }
                >
                  <div className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {user.unreadMessages && user.unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {user.unreadMessages}
                      </span>
                    )}
                  </div>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  to={
                    isHomeUser
                      ? "/dashboard/notifications"
                      : "/dashboard/tradie/notifications"
                  }
                >
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    {user.unreadNotifications &&
                      user.unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {user.unreadNotifications}
                        </span>
                      )}
                  </div>
                </Link>
              </Button>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right mr-2">
                <p className="font-medium">{user.name}</p>
                {user.email && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
              </div>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-3 border-t">
            <div className="px-4 py-2 flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                {user.email && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
            <nav className="mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${window.location.pathname === item.path ? "bg-gray-100" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mr-3 text-gray-500">{item.icon}</div>
                  <span>{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className="ml-auto" variant="destructive">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-grow flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 pt-6">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${window.location.pathname === item.path ? "bg-gray-100 text-primary" : ""}`}
              >
                <div className="mr-3 text-gray-500">{item.icon}</div>
                <span>{item.name}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="ml-auto" variant="destructive">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-left"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-500" />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
