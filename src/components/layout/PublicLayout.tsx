import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import {
  Home,
  Info,
  DollarSign,
  HelpCircle,
  Mail,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(!!user);
      setUser(user);

      if (user) {
        const { data: tradieProfile } = await supabase
          .from("profile_centra_tradie")
          .select("id")
          .eq("id", user.id)
          .single();

        if (tradieProfile) {
          setRole("tradie");
        } else {
          setRole("homeowner");
        }
      }
    };

    fetchUserAndRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setLoggedIn(false);
    navigate("/");
  };

  const goToDashboard = () => {
    if (role === "tradie") {
      navigate("/dashboard/tradie");
    } else {
      navigate("/dashboard");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "How It Works", path: "/how-it-works", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { name: "Pricing", path: "/pricing", icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { name: "About", path: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Logo size="md" variant="full" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center"
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {loggedIn ? (
                <>
                  <Button variant="outline" size="sm" onClick={goToDashboard}>
                    Dashboard
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-3 border-t mt-3">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  </Link>
                ))}
                <div className="pt-2 border-t mt-2 space-y-2">
                  {loggedIn ? (
                    <>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          goToDashboard();
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button size="sm" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="md" variant="full" />
              </div>
              <p className="text-sm text-gray-600">
                Connecting homeowners with skilled trade professionals across
                Australia.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-600 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Tradies</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/register?type=tradie" className="text-gray-600 hover:text-primary">
                    Join as a Tradie
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-primary">
                    Lead Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Homeowners</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/post-job" className="text-gray-600 hover:text-primary">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-primary">
                    Get Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Locentra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
