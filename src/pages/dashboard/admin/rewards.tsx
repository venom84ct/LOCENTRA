import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Redemption {
  id: string;
  user_id: string;
  reward_name: string;
  email: string;
  status: string;
  method: string;
  created_at: string;
}

const AdminRewardsPage = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  const fetchRedemptions = async () => {
    const { data, error } = await supabase
      .from("reward_redemptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setRedemptions(data || []);
  };

  const handleMarkFulfilled = async (id: string) => {
    const { error } = await supabase
      .from("reward_redemptions")
      .update({ status: "fulfilled" })
      .eq("id", id);

    if (!error) {
      setRedemptions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "fulfilled" } : r))
      );
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  return (
    <DashboardLayout userType="admin" user={{ email: "admin@locentra.com" }}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Reward Redemptions</h1>
        {redemptions.length === 0 ? (
          <p>No redemptions found.</p>
        ) : (
          <div className="space-y-4">
            {redemptions.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {r.reward_name}
                    <Badge
                      variant={
                        r.status === "fulfilled" ? "success" : "secondary"
                      }
                    >
                      {r.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> {r.email}</p>
                  <p><strong>Requested:</strong> {new Date(r.created_at).toLocaleString()}</p>
                  <p><strong>Method:</strong> {r.method}</p>

                  {r.status !== "fulfilled" && (
                    <div className="mt-3">
                      <Button
                        variant="default"
                        onClick={() => handleMarkFulfilled(r.id)}
                      >
                        Mark as Fulfilled
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminRewardsPage;
