import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, CreditCard, CheckCircle2 } from "lucide-react";

interface CreditBundle {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  popular?: boolean;
}

interface Transaction {
  id: string;
  type: "purchase" | "usage" | "bonus";
  description: string;
  amount: number;
  date: string;
}

interface CreditWalletProps {
  credits: number;
  transactions?: Transaction[];
}

const creditBundles: CreditBundle[] = [
  { id: "starter", name: "Starter", price: 25, credits: 5, bonusCredits: 0 },
  { id: "standard", name: "Standard", price: 45, credits: 10, bonusCredits: 0 },
  { id: "pro", name: "Pro", price: 80, credits: 20, bonusCredits: 0 },
  { id: "elite", name: "Elite", price: 180, credits: 50, bonusCredits: 0 },
];

const defaultTransactions: Transaction[] = [
  {
    id: "t1",
    type: "purchase",
    description: "Medium Credit Bundle",
    amount: 110,
    date: "2023-06-15",
  },
  {
    id: "t2",
    type: "usage",
    description: "Lead: Bathroom Renovation",
    amount: -5,
    date: "2023-06-16",
  },
  {
    id: "t3",
    type: "usage",
    description: "Lead: Emergency Plumbing",
    amount: -10,
    date: "2023-06-17",
  },
  {
    id: "t4",
    type: "bonus",
    description: "Weekly Performance Reward",
    amount: 5,
    date: "2023-06-18",
  },
];

const CreditWallet: React.FC<CreditWalletProps> = ({
  credits,
  transactions = defaultTransactions,
}) => {
  const [selectedBundle, setSelectedBundle] = useState<CreditBundle | null>(
    null,
  );
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handlePurchase = () => {
    // In a real app, this would call an API to process the payment
    setTimeout(() => {
      setPurchaseComplete(true);
    }, 1000);
  };

  const resetPurchaseState = () => {
    setSelectedBundle(null);
    setPurchaseComplete(false);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2 h-5 w-5" /> Credit Wallet
        </CardTitle>
        <CardDescription>Purchase and manage your lead credits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg mb-6">
            <div>
              <p className="text-sm text-gray-500">Available Credits</p>
              <p className="text-3xl font-bold">{credits}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Buy Credits</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                {!purchaseComplete ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Purchase Credits</DialogTitle>
                      <DialogDescription>
                        Select a credit bundle below to purchase.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {creditBundles.map((bundle) => (
                        <div
                          key={bundle.id}
                          className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer ${selectedBundle?.id === bundle.id ? "border-primary bg-primary/5" : ""} ${bundle.popular ? "border-primary" : ""}`}
                          onClick={() => setSelectedBundle(bundle)}
                        >
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">
                                {bundle.name} Bundle
                              </p>
                              {bundle.popular && (
                                <Badge className="ml-2">Best Value</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {bundle.credits} credits
                              {bundle.bonusCredits > 0 && (
                                <span className="text-green-600">
                                  {" "}
                                  + {bundle.bonusCredits} bonus
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">${bundle.price}</p>
                            <p className="text-xs text-gray-500">
                              $
                              {(
                                bundle.price /
                                (bundle.credits + bundle.bonusCredits)
                              ).toFixed(2)}
                              /credit
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedBundle(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePurchase}
                        disabled={!selectedBundle}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span className="text-red-600">
                          Pay ${selectedBundle?.price || 0}
                        </span>
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <div className="text-center py-6 space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <DialogTitle>Purchase Complete!</DialogTitle>
                      <DialogDescription>
                        <p className="mb-2">
                          You have successfully purchased the{" "}
                          {selectedBundle?.name} Bundle.
                        </p>
                        <div className="bg-muted p-4 rounded-md my-4">
                          <div className="flex justify-between">
                            <span>Credits:</span>
                            <span className="font-medium">
                              {selectedBundle?.credits}
                            </span>
                          </div>
                          {selectedBundle?.bonusCredits ? (
                            <div className="flex justify-between">
                              <span>Bonus Credits:</span>
                              <span className="font-medium text-green-600">
                                +{selectedBundle?.bonusCredits}
                              </span>
                            </div>
                          ) : null}
                          <div className="flex justify-between border-t mt-2 pt-2">
                            <span>Total Added:</span>
                            <span className="font-medium">
                              {(selectedBundle?.credits || 0) +
                                (selectedBundle?.bonusCredits || 0)}{" "}
                              credits
                            </span>
                          </div>
                        </div>
                      </DialogDescription>
                    </div>
                    <DialogFooter>
                      <Button onClick={resetPurchaseState}>Close</Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <h3 className="font-medium mb-3">Credit Bundles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {creditBundles.map((bundle) => (
                <Card
                  key={bundle.id}
                  className={bundle.popular ? "border-primary" : ""}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{bundle.name}</CardTitle>
                      {bundle.popular && <Badge>Best Value</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">${bundle.price}</p>
                    <p className="text-sm text-gray-500">
                      {bundle.credits} Credits
                      {bundle.bonusCredits > 0 && (
                        <span className="text-green-600">
                          {" "}
                          + {bundle.bonusCredits} bonus
                        </span>
                      )}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          variant={bundle.popular ? "default" : "outline"}
                        >
                          Purchase
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Purchase Credits</DialogTitle>
                          <DialogDescription>
                            Confirm your credit bundle purchase.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="bg-muted p-4 rounded-md">
                            <div className="flex justify-between">
                              <span>Bundle:</span>
                              <span className="font-medium">{bundle.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium">
                                ${bundle.price}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Credits:</span>
                              <span className="font-medium">
                                {bundle.credits}
                              </span>
                            </div>
                            {bundle.bonusCredits > 0 && (
                              <div className="flex justify-between">
                                <span>Bonus Credits:</span>
                                <span className="font-medium text-green-600">
                                  +{bundle.bonusCredits}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t mt-2 pt-2">
                              <span>Total Credits:</span>
                              <span className="font-medium">
                                {bundle.credits + bundle.bonusCredits}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span className="text-red-600">Pay ${bundle.price}</span>
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Recent Transactions</h3>
            <div className="border rounded-md">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-3 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.type === "purchase"
                        ? "Credit Purchase"
                        : transaction.type === "usage"
                          ? "Lead Purchase"
                          : "Bonus Credits"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-gray-700"}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount} Credits
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditWallet;
