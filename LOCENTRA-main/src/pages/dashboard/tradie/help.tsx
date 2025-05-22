import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, Phone, Mail, HelpCircle, Search } from "lucide-react";

const TradieHelpPage = () => {
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    unreadMessages: 1,
    unreadNotifications: 2,
  };

  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I purchase job leads?",
      answer:
        "To purchase job leads, browse the available leads in your dashboard and click on the 'Purchase Lead' button. You'll need to have sufficient credits in your wallet. Standard jobs cost 5 credits, while emergency jobs cost 10 credits.",
    },
    {
      question: "How do I buy credits?",
      answer:
        "You can buy credits by clicking on the 'Buy Credits' button in your wallet section. We offer various credit bundles with discounts for larger purchases. Payment can be made via credit card, PayPal, or direct bank transfer.",
    },
    {
      question: "How do I increase my chances of winning jobs?",
      answer:
        "To increase your chances of winning jobs, make sure your profile is complete with all your qualifications and experience. Respond quickly to job leads, provide detailed quotes, and maintain a high rating by delivering quality work and excellent customer service.",
    },
    {
      question: "What happens after I purchase a lead?",
      answer:
        "After purchasing a lead, you'll get access to the homeowner's contact details and job specifics. You can then message the homeowner directly through the platform to discuss the job and provide a quote. If the homeowner accepts your quote, the job status will change to 'In Progress'.",
    },
    {
      question: "How do I get verified on the platform?",
      answer:
        "To get verified, you need to submit your trade license, ABN, and insurance details. Our team will review these documents and verify your account, usually within 1-2 business days. Verified tradies appear higher in search results and are more likely to win jobs.",
    },
    {
      question: "What are reward points and how do I earn them?",
      answer:
        "Reward points are earned through platform activity. You earn points by completing jobs (50 points), receiving 5-star reviews (25 points), and referring other tradies (100 points). These points can be redeemed for free credits, premium listing features, and other benefits.",
    },
    {
      question: "How do I report an issue with a homeowner?",
      answer:
        "If you experience any issues with a homeowner, you can report them through your dashboard. Go to the job details, click on 'Report Issue', and provide details about your concern. Our support team will investigate and take appropriate action.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Help & Support</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Live Chat
                </CardTitle>
                <CardDescription>Chat with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Our support team is available Monday to Friday, 9am to 5pm
                  AEST.
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Phone Support
                </CardTitle>
                <CardDescription>Call our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Call us at 1800 123 456 (Monday to Friday, 9am to 5pm AEST)
                </p>
                <Button className="w-full">Call Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Support
                </CardTitle>
                <CardDescription>Send us an email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  We typically respond within 24 hours on business days.
                </p>
                <Button className="w-full">Email Us</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or browse all FAQs
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Show All FAQs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is your inquiry about?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your issue in detail"
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradieHelpPage;
