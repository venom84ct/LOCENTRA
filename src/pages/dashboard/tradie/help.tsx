import React, { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabaseClient";

const TradieHelpPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", userId)
        .single();

      setUser(profile);
    };

    fetchUser();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") || "") as string;
    const email = (formData.get("email") || "") as string;
    const subject = (formData.get("subject") || "") as string;
    const message = (formData.get("message") || "") as string;

    const mailto = `mailto:admin@locentra.com.au?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    window.location.href = mailto;
  };

  const faqs = [
    {
      question: "How do I purchase job leads?",
      answer:
        "To purchase job leads, browse the available leads in your dashboard and click on the 'Purchase Lead' button. You'll need to have sufficient credits in your wallet. Standard jobs cost 1 credit, while emergency jobs cost 2 credits.",
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
        "To get verified, you need to submit your trade license, ABN, and insurance details. Our team will review these documents and verify your account, usually within 1-2 business days.",
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

  if (!user) return null;

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Help & Support</h1>
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" name="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is your inquiry about?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
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
