import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Calendar, Lock, Loader2 } from "lucide-react";

interface PaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  paymentIntentId?: string;
  clientSecret?: string;
}

const PaymentMethodForm = ({
  onSuccess,
  onCancel,
  paymentIntentId,
  clientSecret,
}: PaymentMethodFormProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add space after every 4 digits
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentError(null);

    try {
      // In a real implementation, this would use Stripe.js to tokenize the card
      // and confirm the payment intent with the client secret

      // For demo purposes, we'll simulate a successful payment after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If we have a payment intent, we would confirm it here
      if (paymentIntentId && clientSecret) {
        // This would be where we'd use Stripe.js to confirm the payment
        console.log(`Processing payment intent: ${paymentIntentId}`);
      }

      toast({
        title: "Payment successful",
        description:
          "Your payment has been processed and credits added to your account.",
      });

      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        "There was an error processing your payment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate card details
  const isFormValid = () => {
    return (
      cardName.trim().length > 0 &&
      cardNumber.replace(/\s/g, "").length === 16 &&
      expiryDate.length === 5 &&
      cvv.length === 3
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {paymentError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {paymentError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="cardName">Name on Card</Label>
        <Input
          id="cardName"
          placeholder="John Smith"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            className="pl-10"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            required
            maxLength={19}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              className="pl-10"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              required
              maxLength={5}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="cvv"
              type="password"
              placeholder="123"
              className="pl-10"
              value={cvv}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))
              }
              required
              maxLength={3}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-xs text-muted-foreground">
          For testing, you can use card number 4242 4242 4242 4242 with any
          future expiry date and any 3-digit CVV.
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isFormValid()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
