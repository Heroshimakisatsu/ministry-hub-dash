import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaymentBank() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reference, setReference] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const paymentDetails = location.state as {
    givingType: string;
    amount: string;
    fundType?: string;
    customFundType?: string;
  } || { givingType: "tithe", amount: "0" };

  const handlePayment = () => {
    if (reference.length >= 4) {
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  const handleBack = () => {
    navigate("/member", {
      state: {
        tab: "giving",
        givingType: paymentDetails.givingType,
        amount: paymentDetails.amount,
        fundType: paymentDetails.fundType,
        customFundType: paymentDetails.customFundType,
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Bank Transfer</h1>
            <p className="text-muted-foreground">Complete your payment securely</p>
          </div>
        </div>

        {!showSuccess ? (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <h2 className="font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{paymentDetails.givingType}</span>
                </div>
                {paymentDetails.fundType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fund:</span>
                    <span className="font-medium">{paymentDetails.fundType}</span>
                  </div>
                )}
                {paymentDetails.customFundType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom Fund:</span>
                    <span className="font-medium">{paymentDetails.customFundType}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-emerald-400">${paymentDetails.amount}</span>
                </div>
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="font-semibold mb-4">Bank Details</h2>
              <div className="space-y-4">
                <div className="bg-accent/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">Steward Bank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account Name:</span>
                    <span className="font-medium">FaithFlow Church</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">1002345678</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("1002345678")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Branch Code:</span>
                    <span className="font-medium">8801</span>
                  </div>
                </div>

                <div>
                  <Label>Reference Number</Label>
                  <Input
                    type="text"
                    placeholder="Enter your bank reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use your name as reference</p>
                </div>

                {showError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Please enter a valid reference number
                  </div>
                )}

                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Payment Instructions:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Transfer ${paymentDetails.amount} to the account above</li>
                    <li>Use your name as the reference</li>
                    <li>Enter the reference number below</li>
                    <li>Wait for confirmation (within 24 hours)</li>
                  </ol>
                </div>

                <Button className="w-full" onClick={handlePayment}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Confirm Bank Transfer
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-surface p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Transfer Initiated!</h2>
            <p className="text-muted-foreground mb-6">
              Your bank transfer of ${paymentDetails.amount} has been initiated.
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              <p>Reference: {reference}</p>
              <p className="mt-1">Confirmation will be sent within 24 hours</p>
            </div>
            <Button onClick={() => navigate("/member")}>Return to Portal</Button>
          </div>
        )}
      </div>
    </div>
  );
}
