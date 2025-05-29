import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Wallet } from "lucide-react";

interface Props {
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const BuyCreditsModal: React.FC<Props> = ({ onClose, onPurchase }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded">
            <div className="flex items-center gap-2">
              <Wallet />
              <span>10 Credits</span>
            </div>
            <Button onClick={() => onPurchase(10)}><Banknote /> $10</Button>
          </div>
          <div className="flex justify-between items-center p-4 border rounded">
            <div className="flex items-center gap-2">
              <Wallet />
              <span>25 Credits</span>
            </div>
            <Button onClick={() => onPurchase(25)}><Banknote /> $20</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyCreditsModal;
