import React from "react";
import { Wallet, Banknote } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Check, Package } from "lucide-react";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number, cost: number) => void;
}

const creditPackages = [
  { id: "small", name: "Starter", credits: 20, cost: 50, popular: false },
  { id: "medium", name: "Standard", credits: 50, cost: 100, popular: true },
  { id: "large", name: "Premium", credits: 100, cost: 180, popular: false },
  { id: "xl", name: "Business", credits: 200, cost: 320, popular: false },
];

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [selectedPackage, setSelectedPackage] = useState("medium");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePurchase = () => {
    const pkg = creditPackages.find((p) => p.id === selectedPackage);
    if (pkg) {
      onPurchase(pkg.credits, pkg.cost);
    }
  };

  const selectedPkg = creditPackages.find((p) => p.id === selectedPackage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
          <DialogDescription>
            Purchase credits to access job leads
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Select a package</h3>
            <RadioGroup
              value={selectedPackage}
              onValueChange={setSelectedPackage}
              className="grid grid-cols-2 gap-3"
            >
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`border rounded-md p-3 cursor-pointer relative ${selectedPackage === pkg.id ? "border-primary bg-primary/5" : "border-gray-200"}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <RadioGroupItem
                    value={pkg.id}
                    id={pkg.id}
                    className="sr-only"
                  />
                  {pkg.popular && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pkg.credits} credits
                      </p>
                    </div>
                    <p className="font-bold">${pkg.cost}</p>
                  </div>
                  {selectedPackage === pkg.id && (
                    <div className="absolute top-1/2 -translate-y-1/2 -right-2 bg-primary rounded-full p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {selectedPkg?.credits} credits for ${selectedPkg?.cost}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPkg?.id === "small"
                    ? "Good for occasional jobs"
                    : selectedPkg?.id === "medium"
                      ? "Most popular for regular work"
                      : selectedPkg?.id === "large"
                        ? "Great value for active tradies"
                        : "Best value for businesses"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Payment method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  PayPal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center">
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={handleCardDetailsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  name="name"
                  placeholder="John Smith"
                  value={cardDetails.name}
                  onChange={handleCardDetailsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Expiry Date</Label>
                  <Input
                    id="card-expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleCardDetailsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    name="cvc"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={handleCardDetailsChange}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-md text-center">
                <p className="text-sm">
                  You will be redirected to PayPal to complete your purchase
                  after clicking the Pay button.
                </p>
              </div>
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-2">
                  Bank Transfer Details:
                </p>
                <p className="text-sm">Account Name: Locentra Pty Ltd</p>
                <p className="text-sm">BSB: 123-456</p>
                <p className="text-sm">Account Number: 12345678</p>
                <p className="text-sm">Reference: Your registered email</p>
                <p className="text-sm mt-2 text-muted-foreground">
                  Credits will be added to your account once payment is
                  confirmed.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePurchase}>Pay ${selectedPkg?.cost}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyCreditsModal;
