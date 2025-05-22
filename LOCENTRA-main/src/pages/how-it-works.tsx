import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";

const HowItWorks = () => {
  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <h1 className="text-4xl font-bold mb-8 text-center">How It Works</h1>

        <div className="max-w-3xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">
              For Homeowners
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Post Your Job</h3>
                <p className="text-muted-foreground">
                  Describe your project needs, timeline, and budget. Add photos
                  to help tradies understand the job better.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Receive Quotes</h3>
                <p className="text-muted-foreground">
                  Qualified tradies will review your job and send you
                  competitive quotes. Compare options to find the best match.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Hire & Complete</h3>
                <p className="text-muted-foreground">
                  Select your preferred tradie, communicate through our
                  platform, and mark the job complete when satisfied.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">For Tradies</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Create Your Profile
                </h3>
                <p className="text-muted-foreground">
                  Showcase your skills, experience, and previous work. Verify
                  your credentials to build trust with potential clients.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Browse & Purchase Leads
                </h3>
                <p className="text-muted-foreground">
                  Find jobs that match your skills and location. Purchase leads
                  with credits to access full job details.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Quote & Complete Jobs
                </h3>
                <p className="text-muted-foreground">
                  Send competitive quotes, communicate with homeowners, and
                  build your reputation through quality work and reviews.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Why Choose Locentra?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 p-1 rounded mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>
                  Verified tradies with proper credentials and reviews
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 p-1 rounded mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Secure messaging and payment system</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 p-1 rounded mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Emergency job posting for urgent needs</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 p-1 rounded mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Rewards program for loyal users</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HowItWorks;
