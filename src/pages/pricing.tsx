import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <h1 className="text-4xl font-bold mb-4 text-center">Pricing</h1>
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Transparent pricing for homeowners and tradies with options for every
          need
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Homeowner Pricing */}
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-primary/10 p-6">
              <h2 className="text-2xl font-bold">For Homeowners</h2>
              <p className="text-muted-foreground mt-2">
                Post jobs and find qualified tradies
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">Free</span>
                <span className="text-muted-foreground">for standard jobs</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Unlimited standard job postings</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Access to verified tradies</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Secure messaging system</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Job status tracking</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Centra Resident rewards program</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Emergency Jobs</h3>
                <p className="text-muted-foreground mb-4">
                  For urgent needs with faster response times
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold">$10</span>
                  <span className="text-muted-foreground">
                    per emergency posting
                  </span>
                </div>
                <Button asChild className="w-full">
                  <Link to="/register?type=homeowner">Sign Up Free</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Tradie Pricing */}
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-primary/10 p-6">
              <h2 className="text-2xl font-bold">For Tradies</h2>
              <p className="text-muted-foreground mt-2">
                Purchase leads and grow your business
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">Credit-based</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  Pay only for the leads you want
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Standard Jobs:</span>
                    <span className="ml-1">1 credit per lead</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Emergency Jobs:</span>
                    <span className="ml-1">2 credits per lead</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Verified business profile</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Client messaging system</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Tradie rewards program</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold">Credit Bundles</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <div className="font-medium">Starter</div>
                    <div className="text-lg font-bold text-red-600">$25</div>
                    <div className="text-sm text-muted-foreground">5 credits</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="font-medium">Standard</div>
                    <div className="text-lg font-bold text-red-600">$45</div>
                    <div className="text-sm text-muted-foreground">10 credits</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="font-medium">Pro</div>
                    <div className="text-lg font-bold text-red-600">$80</div>
                    <div className="text-sm text-muted-foreground">20 credits</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="font-medium">Elite</div>
                    <div className="text-lg font-bold text-red-600">$180</div>
                    <div className="text-sm text-muted-foreground">50 credits</div>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/register?type=tradie">Sign Up Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-muted p-8 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">
                Do Centra Residents pay to post jobs?
              </h3>
              <p className="text-muted-foreground">
                No, standard job postings are completely free for Centra
                Residents. Only emergency jobs that require urgent attention
                have a small fee.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                How do tradies purchase credits?
              </h3>
              <p className="text-muted-foreground">
                Tradies can purchase credit bundles through their dashboard
                using credit card, PayPal, or direct bank transfer.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                Are there any subscription fees?
              </h3>
              <p className="text-muted-foreground">
                No, there are no recurring subscription fees. Tradies only pay
                for the leads they're interested in pursuing.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground">
                Credits remain valid for 12 months from the date of purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Pricing;
