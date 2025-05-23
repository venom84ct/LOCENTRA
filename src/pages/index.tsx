import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Star,
  Wrench,
  Home as HomeIcon,
  Shield,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,import React from "react";

} from "lucide-react";
import PublicLayout from "./layout/PublicLayout";
import RecentJobsShowcase from "./jobs/RecentJobsShowcase";

const Home = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                Australia's Trusted Tradie Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Connect with Qualified Tradies for Your Home Projects
              </h1>
              <p className="text-xl text-gray-600">
                Post your job for free and get quotes from verified local trade
                professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => {
                    // Check if user is logged in and is a centra resident
                    const isLoggedIn =
                      localStorage.getItem("isLoggedIn") === "true";
                    const userType = localStorage.getItem("userType");

                    if (isLoggedIn && userType === "centraResident") {
                      window.location.href = "/post-job";
                    } else {
                      window.location.href = "/login?redirect=/post-job";
                    }
                  }}
                >
                  Post a Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register?type=tradie">Join as a Tradie</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Check className="text-green-500 mr-1 h-4 w-4" />
                  <span>Free for homeowners</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-500 mr-1 h-4 w-4" />
                  <span>Verified tradies</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-500 mr-1 h-4 w-4" />
                  <span>Secure platform</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-red-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 rounded-full opacity-10"></div>
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Tradie working on a construction site"
                className="rounded-lg shadow-xl w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Locentra Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple process to connect homeowners with the right tradies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-2 border-gray-100">
              <CardContent className="pt-6">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <HomeIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Post Your Job</h3>
                <p className="text-gray-600">
                  Describe your project needs, timeline, and budget. Add photos
                  to help tradies understand the job better.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-100">
              <CardContent className="pt-6">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Get Matched</h3>
                <p className="text-gray-600">
                  Qualified tradies in your area will review your job and send
                  you competitive quotes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-100">
              <CardContent className="pt-6">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Hire & Complete</h3>
                <p className="text-gray-600">
                  Compare quotes, hire your preferred tradie, and manage the
                  entire job through our secure platform.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/how-it-works">Learn More About Our Process</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from homeowners and tradies who have used our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Emma Johnson",
                role: "Homeowner",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
                quote:
                  "I found a great electrician through Locentra who fixed my wiring issues quickly. The platform made it easy to compare quotes and communicate.",
                rating: 5,
              },
              {
                name: "Michael Brown",
                role: "Homeowner",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                quote:
                  "Posting a job was simple and I received responses within hours. The tradie I hired did excellent work on my bathroom renovation.",
                rating: 5,
              },
              {
                name: "David Chen",
                role: "Tradie - Plumber",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                quote:
                  "As a plumber, Locentra has helped me find quality leads and grow my business. The credit system is fair and the platform is easy to use.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recent Jobs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse the latest jobs posted by homeowners
            </p>
          </div>

          <RecentJobsShowcase />

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard/find-jobs">View All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-6">
                Join thousands of Centra Residents and tradies who are already
                using Locentra to connect, quote, and complete jobs with
                confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/post-job">Post a Job</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/register?type=tradie">Join as a Tradie</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-white rounded-full opacity-10"></div>
                <Shield className="h-48 w-48 text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Trusted Platform
                    </h3>
                    <p>Verified Tradies</p>
                    <p>Secure Messaging</p>
                    <p>Quality Guarantees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
