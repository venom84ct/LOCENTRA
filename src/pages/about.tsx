import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Building2, Users, Shield, Award } from "lucide-react";

const About = () => {
  return (
    <PublicLayout>
      <div className="container py-12 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            About Locentra
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Connecting homeowners with skilled trade professionals since 2023
          </p>

          <div className="prose prose-lg max-w-none">
            <p>
              Locentra was founded with a simple mission: to create a trusted
              marketplace where homeowners can easily find qualified trade
              professionals for their home improvement and repair needs, while
              helping tradies grow their businesses through quality leads.
            </p>

            <p>
              Our platform bridges the gap between homeowners seeking reliable
              services and skilled tradies looking for new opportunities. We
              understand the challenges both sides face in this process -
              homeowners struggle to find trustworthy professionals, while
              tradies spend valuable time and resources searching for new
              clients.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Trust & Safety</h3>
                </div>
                <p className="text-muted-foreground">
                  We verify all trade professionals on our platform, ensuring
                  they have the proper licenses, insurance, and qualifications
                  to perform their work safely and effectively.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Community</h3>
                </div>
                <p className="text-muted-foreground">
                  We're building a community where quality work is recognized
                  and rewarded, helping both homeowners and tradies build
                  lasting relationships based on trust and excellence.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Quality</h3>
                </div>
                <p className="text-muted-foreground">
                  We promote excellence through our review system and rewards
                  program, encouraging the highest standards of workmanship and
                  customer service.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Local Focus</h3>
                </div>
                <p className="text-muted-foreground">
                  We support local trade businesses and help them thrive by
                  connecting them with homeowners in their area who need their
                  specific skills and services.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>

            <p>
              Locentra is led by a team of professionals with backgrounds in
              construction, technology, and customer service. Our diverse team
              brings together expertise from various fields to create a platform
              that truly understands the needs of both homeowners and trade
              professionals.
            </p>

            <p>
              We're passionate about improving the home service industry and
              making it more transparent, efficient, and rewarding for everyone
              involved. Our team is constantly working to enhance the platform
              based on user feedback and industry trends.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitment</h2>

            <p>At Locentra, we're committed to:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Providing a safe and secure platform for all users</li>
              <li>Supporting the growth of local trade businesses</li>
              <li>
                Helping Centra Residents find qualified professionals quickly
                and easily
              </li>
              <li>
                Continuously improving our services based on user feedback
              </li>
              <li>
                Maintaining the highest standards of privacy and data protection
              </li>
            </ul>

            <p className="mt-8">
              Thank you for choosing Locentra. We're excited to be part of your
              home improvement journey and to help connect you with the right
              professionals for your needs.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
