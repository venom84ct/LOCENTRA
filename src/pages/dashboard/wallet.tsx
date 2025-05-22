import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  PlusCircle,
  Clock,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  BarChart4,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface CreditBundle {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  savings?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "trans1",
    type: "debit",
    amount: 5,
    description: "Lead purchase: Kitchen Sink Replacement",
    date: "2023-06-14",
    status: "completed",
  },
  {
    id: "trans2",
    type: "debit",
    amount: 10,
    description: "Lead purchase: Emergency Hot Water System Repair",
    date: "2023-06-13",
    status: "completed",
  },
  {
    id: "trans3",
    type: "credit",
    amount: 50,
    description: "Credit bundle purchase: 50 credits",
    date: "2023-06-10",
    status: "completed",
  },
  {
    id: "trans4",
    type: "debit",
    amount: 5,
    description: "Lead purchase: Bathroom Renovation",
    date: "2023-06-05",
    status: "completed",
  },
  {
    id: "trans5",
    type: "credit",
    amount: 20,
    description: "Bonus credits: Referral program",
    date: "2023-06-01",
    status: "completed",
  },
];

const creditBundles: CreditBundle[] = [
  {
    id: "bundle1",
    name: "Starter",
    credits: 50,
    price: 50,
  },
  {
    id: "bundle2",
    name: "Popular",
    credits: 110,
    price: 100,
    popular: true,
    savings: "Save 10%",
  },
  {
    id: "bundle3",
    name: "Professional",
    credits: 240,
    price: 200,
    savings: "Save 16%",
  },
  {
    id: "bundle4",
    name: "Business",
    credits: 650,
    price: 500,
    savings: "Save 23%",
  },
];

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("credits");

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    credits: 45,
    rewardPoints: 520,
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Credit Wallet</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buy Credits
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Credit Balance */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle>Available Credits</CardTitle>
                <CardDescription>Your current credit balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">{user.credits}</p>
                    <p className="text-sm text-muted-foreground">
                      credits available
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Standard Job: 5 credits</span>
                    <span>Emergency Job: 10 credits</span>
                  </div>
                  <Progress
                    value={(user.credits / 100) * 100}
                    className="h-2"
                  />
                </div>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTransactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${transaction.type === "credit" ? "bg-green-100" : "bg-blue-100"}`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft
                            className={`h-6 w-6 ${transaction.type === "credit" ? "text-green-600" : "text-blue-600"}`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`h-6 w-6 ${transaction.type === "credit" ? "text-green-600" : "text-blue-600"}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-blue-600"}`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {transaction.amount} credits
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("history")}
                >
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your credit usage this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Standard Jobs</span>
                      <span>15 credits</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Emergency Jobs</span>
                      <span>20 credits</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Used</span>
                      <span>35 credits</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Monthly Average</p>
                      <p className="text-xs text-muted-foreground">
                        Last 3 months
                      </p>
                    </div>
                    <div className="text-lg font-bold">42 credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="w-full justify-start">
              <TabsTrigger value="credits">Buy Credits</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="credits" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {creditBundles.map((bundle) => (
                  <Card
                    key={bundle.id}
                    className={`bg-white ${bundle.popular ? "border-primary" : ""}`}
                  >
                    {bundle.popular && (
                      <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{bundle.name}</CardTitle>
                      <CardDescription>
                        {bundle.credits} credits
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-3xl font-bold">${bundle.price}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(bundle.price / bundle.credits).toFixed(2)} per
                          credit
                        </p>
                        {bundle.savings && (
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            {bundle.savings}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={bundle.popular ? "default" : "outline"}
                      >
                        Purchase
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card className="bg-white mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">
                            Expires 12/25
                          </p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>

                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your credit transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${transaction.type === "credit" ? "bg-green-100" : "bg-blue-100"}`}
                          >
                            {transaction.type === "credit" ? (
                              <ArrowDownLeft
                                className={`h-6 w-6 ${transaction.type === "credit" ? "text-green-600" : "text-blue-600"}`}
                              />
                            ) : (
                              <ArrowUpRight
                                className={`h-6 w-6 ${transaction.type === "credit" ? "text-green-600" : "text-blue-600"}`}
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {transaction.date}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-blue-600"}`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {transaction.amount} credits
                          </p>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "outline"
                                : transaction.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="mt-1"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export History
                  </Button>
                  <Button variant="outline" disabled>
                    Older Transactions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Credit Usage Analytics</CardTitle>
                  <CardDescription>
                    Insights into your credit spending
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-50">
                    <div className="text-center">
                      <BarChart4 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Usage Chart</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        This chart would display your credit usage over time,
                        showing patterns and helping you optimize your spending.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Most Common Usage</p>
                      <p className="text-xl font-bold">Standard Jobs</p>
                      <p className="text-sm text-muted-foreground">
                        65% of your credits
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Average Monthly</p>
                      <p className="text-xl font-bold">42 Credits</p>
                      <p className="text-sm text-muted-foreground">
                        Based on last 3 months
                      </p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm text-amber-600">Conversion Rate</p>
                      <p className="text-xl font-bold">78%</p>
                      <p className="text-sm text-muted-foreground">
                        Leads to actual jobs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Optimize your credit usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Bundle Savings</p>
                          <p className="text-sm text-muted-foreground">
                            Based on your usage, the Professional bundle would
                            save you $45 per month.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Timing Optimization</p>
                          <p className="text-sm text-muted-foreground">
                            Purchasing leads on weekdays results in 15% higher
                            conversion rates for your trade.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WalletPage;
