import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { supabase } from "@/lib/supabaseClient";
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
  X,
} from "lucide-react";

// Fallback mock in case no transactions exist
const mockTransactions = [
  { id: "1", type: "debit", amount: 5, description: "Lead purchase", date: "2023-06-14", status: "completed" },
];

const creditBundles = [
  { id: "b1", name: "Starter", credits: 5, price: 25 },
  { id: "b2", name: "Standard", credits: 10, price: 45 },
  { id: "b3", name: "Pro", credits: 20, price: 80 },
  { id: "b4", name: "Elite", credits: 50, price: 180 },
];

const WalletPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("credits");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileData) setProfile(profileData);

      const { data: txData } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (txData) setTransactions(txData);
    };

    fetchData();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Credit Wallet</h1>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buy Credits
            </Button>
          </div>

          {/* Credit Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Credits</CardTitle>
                <CardDescription>Your current credit balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-4xl font-bold">{profile?.credits || 0}</p>
                    <p className="text-sm text-muted-foreground">credits available</p>
                  </div>
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((profile?.credits || 0) / 100) * 100} className="h-2" />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(transactions.length ? transactions : mockTransactions).map((t) => (
                  <div key={t.id} className="flex justify-between">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${t.type === "credit" ? "bg-green-100" : "bg-blue-100"}`}>
                        {t.type === "credit" ? (
                          <ArrowDownLeft className="h-6 w-6 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                    <div className={`font-medium ${t.type === "credit" ? "text-green-600" : "text-blue-600"}`}>
                      {t.type === "credit" ? "+" : "-"}
                      {t.amount}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="credits">Buy Credits</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="credits" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creditBundles.map((bundle) => (
                  <Card key={bundle.id} className={bundle.popular ? "border-primary" : ""}>
                    {bundle.popular && (
                      <div className="bg-primary text-white text-center py-1 text-sm font-medium rounded-t-md">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{bundle.name}</CardTitle>
                      <CardDescription>{bundle.credits} credits</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-2xl font-bold">${bundle.price}</p>
                      {bundle.savings && (
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          {bundle.savings}
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() =>
                          bundle.id === "b1"
                            ? navigate("/pay/starter")
                            : bundle.id === "b2"
                            ? navigate("/pay/standard")
                            : bundle.id === "b3"
                            ? navigate("/pay/pro")
                            : setIsModalOpen(true)
                        }
                      >
                        Purchase
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(transactions.length ? transactions : mockTransactions).map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                      <div className={`font-medium ${t.type === "credit" ? "text-green-600" : "text-blue-600"}`}>
                        {t.type === "credit" ? "+" : "-"}
                        {t.amount}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Payment Modal</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This is a placeholder modal. Integrate your payment gateway here.
            </p>
            <Button className="w-full" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WalletPage;
