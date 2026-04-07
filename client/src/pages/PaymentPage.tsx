import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "bank" | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const coursePrice = 49.99; // Example price

  const handleMobileMoneyPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate mobile money payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentComplete(true);
      toast.success("Payment successful! Certificate will be generated.");
      setTimeout(() => navigate("/certificates"), 2000);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate bank payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentComplete(true);
      toast.success("Payment successful! Certificate will be generated.");
      setTimeout(() => navigate("/certificates"), 2000);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-slate-600 mb-6">
              Your payment has been processed. Your certificate is being
              generated and will be available shortly.
            </p>
            <Button
              onClick={() => navigate("/certificates")}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              View My Certificates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Get Your Certificate</h1>
          <p className="text-indigo-100">
            Complete your course and earn a recognized certificate
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mobile Money */}
            <Card
              className={`cursor-pointer transition-all ${
                paymentMethod === "mobile"
                  ? "ring-2 ring-indigo-600 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setPaymentMethod("mobile")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-indigo-600" />
                  Mobile Money Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Pay securely using mobile money services like MTN Mobile
                  Money, Airtel Money, or Vodafone Cash.
                </p>

                {paymentMethod === "mobile" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Select Provider
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="vodafone">
                            Vodafone Cash
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        className="w-full"
                      />
                    </div>

                    <Button
                      onClick={handleMobileMoneyPayment}
                      disabled={isProcessing}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isProcessing ? "Processing..." : "Pay with Mobile Money"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bank Transfer */}
            <Card
              className={`cursor-pointer transition-all ${
                paymentMethod === "bank"
                  ? "ring-2 ring-indigo-600 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                  Bank Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Make a direct bank transfer to complete your payment securely.
                </p>

                {paymentMethod === "bank" && (
                  <div className="space-y-4 pt-4 border-t bg-slate-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bank Name:</span>
                        <span className="font-semibold">
                          Ghana Commercial Bank
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Account Name:</span>
                        <span className="font-semibold">E-HUB Platform</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Account Number:</span>
                        <span className="font-mono font-semibold">
                          1234567890
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">SWIFT Code:</span>
                        <span className="font-mono font-semibold">
                          GCBLGHAC
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        ℹ️ Please use your course ID as the reference:{" "}
                        <span className="font-semibold">{courseId}</span>
                      </p>
                    </div>

                    <Button
                      onClick={handleBankPayment}
                      disabled={isProcessing}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isProcessing ? "Processing..." : "Confirm Bank Transfer"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Course</p>
                  <p className="font-semibold text-slate-900">
                    Advanced Web Development
                  </p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">
                      ${coursePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (0%)</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">
                      ${coursePrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">
                        Certificate included
                      </span>{" "}
                      - Valid worldwide
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Lifetime access</span> -
                      Revisit anytime
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Your payment is secure and encrypted. We accept all major
                    payment methods.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
