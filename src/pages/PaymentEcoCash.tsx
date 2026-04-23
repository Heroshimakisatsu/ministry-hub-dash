import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaymentEcoCash() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Get payment details from location state
  const paymentDetails = location.state as {
    givingType: string;
    amount: string;
    fundType?: string;
    customFundType?: string;
  } || { givingType: "tithe", amount: "0" };

  const handlePayment = () => {
    if (phoneNumber.length === 10) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">EcoCash Payment</h1>
            <p className="text-muted-foreground">Complete your payment securely</p>
          </div>
        </div>

        {!showSuccess ? (
          <div className="space-y-6">
            {/* Payment Summary */}
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

            {/* Payment Form */}
            <div className="card-surface p-6">
              <h2 className="font-semibold mb-4">EcoCash Details</h2>
              <div className="space-y-4">
                <div>
                  <Label>EcoCash Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+263 7XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter your EcoCash registered number</p>
                </div>

                {showError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Please enter a valid 10-digit phone number
                  </div>
                )}

                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Payment Instructions:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>You will receive an EcoCash push notification</li>
                    <li>Enter your EcoCash PIN to authorize</li>
                    <li>Wait for confirmation message</li>
                  </ol>
                </div>

                <Button className="w-full" onClick={handlePayment}>
                  <Phone className="h-4 w-4 mr-2" />
                  Pay ${paymentDetails.amount} via EcoCash
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="card-surface p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your payment of ${paymentDetails.amount} has been processed successfully.
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              <p>A confirmation SMS has been sent to {phoneNumber}</p>
              <p className="mt-1">Transaction ID: #{Date.now()}</p>
            </div>
            <Button onClick={() => navigate("/member")}>Return to Portal</Button>
          </div>
        )}
      </div>
    </div>
  );
}
