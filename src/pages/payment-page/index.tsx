import React, { useEffect, useMemo, useState } from 'react';

// Shadcn / TailwindUI style components (assume these exist in your project)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'; // adapt paths to your project
import { Input } from '../../components/ui/input';
// import { RadioGroup } from "../../components/ui/radio-group";
import { Label } from '../../components/ui/label';
// import { Separator } from "@/components/ui/separator";
import { Button } from '../../components/ui/button';

// Note: This file is a single-file React + TypeScript UI for a payment page.
// It uses Tailwind CSS and shadcn-style components. Replace imports with
// your actual component library paths if different.

type PaymentMethod = 'card' | 'upi' | 'cash' | 'wallet';

export const PaymentPage: React.FC = () => {
  // UI state
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [walletOption, setWalletOption] = useState('Paytm');
  const [agreeTOS, setAgreeTOS] = useState(true);

  // Timer for 10 minutes (600 seconds)
  const SESSION_SECONDS = 600;
  const [remaining, setRemaining] = useState(SESSION_SECONDS);

  // Count-down effect
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [remaining]);

  // format mm:ss
  const remainingText = useMemo(() => {
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [remaining]);

  // Basic validation for enabling pay button
  const isCardValid = useMemo(() => {
    // naive checks: 16-digit number, name present, expiry MM/YY or MM/YYYY, cvv 3 or 4 digits
    const num = cardNumber.replace(/\s+/g, '');
    const cardOk = /^\d{12,19}$/.test(num); // allow 12-19 digits (some cards vary)
    const nameOk = cardName.trim().length > 2;
    const expOk = /^(0[1-9]|1[0-2])\/(?:\d{2}|\d{4})$/.test(expiry.trim());
    const cvvOk = /^\d{3,4}$/.test(cvv.trim());
    return cardOk && nameOk && expOk && cvvOk;
  }, [cardNumber, cardName, expiry, cvv]);

  const isUpiValid = useMemo(() => {
    return /^\w+@[\w.-]+$/.test(upiId.trim());
  }, [upiId]);

  const isPayEnabled = useMemo(() => {
    if (remaining <= 0) return false;
    if (!agreeTOS) return false;
    switch (method) {
      case 'card':
        return isCardValid;
      case 'upi':
        return isUpiValid;
      case 'cash':
        return true; // cash on arrival - minimal requirements
      case 'wallet':
        return !!walletOption;
      default:
        return false;
    }
  }, [method, isCardValid, isUpiValid, walletOption, remaining, agreeTOS]);

  // helper: format card number to groups of 4
  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();

  // submit handler (stub)
  const handlePay = () => {
    if (!isPayEnabled) return;
    // Here you would call your payment API depending on `method`.
    // For demo we just show an alert (replace with real logic).
    alert(`Paying via ${method.toUpperCase()} — total ₹5,185.00`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {/* Left: Payment card / form */}
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Select a Payment Method
              </CardTitle>
              <div className="text-sm text-slate-600">
                Secure checkout • {remainingText}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Payment method selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setMethod('card')}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-shadow w-full text-left ${
                    method === 'card'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white'
                  }`}
                  aria-pressed={method === 'card'}
                >
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-500 text-white">
                    💳
                  </div>
                  <div>
                    <div className="text-sm font-medium">Card</div>
                    <div className="text-xs text-slate-500">
                      Visa, Master, Amex
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMethod('upi')}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-shadow w-full text-left ${
                    method === 'upi'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-green-500 text-white">
                    🔗
                  </div>
                  <div>
                    <div className="text-sm font-medium">UPI</div>
                    <div className="text-xs text-slate-500">
                      PhonePe, GPay, BHIM
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMethod('wallet')}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-shadow w-full text-left ${
                    method === 'wallet'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-yellow-500 text-white">
                    💼
                  </div>
                  <div>
                    <div className="text-sm font-medium">Wallet</div>
                    <div className="text-xs text-slate-500">
                      Paytm, MobiKwik
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMethod('cash')}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-shadow w-full text-left ${
                    method === 'cash'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-700 text-white">
                    💵
                  </div>
                  <div>
                    <div className="text-sm font-medium">Cash</div>
                    <div className="text-xs text-slate-500">Pay at counter</div>
                  </div>
                </button>
              </div>

              {/* <Separator /> */}
              <div className="h-1 bg-gray-200"></div>

              {/* Dynamic form area */}
              <div className="space-y-4">
                {method === 'card' && (
                  <div className="grid gap-4">
                    {/* Card number */}
                    <div>
                      <Label>Card number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(cardNumber)}
                        onChange={(e) =>
                          setCardNumber(e.target.value.replace(/\D/g, ''))
                        }
                        maxLength={23}
                        aria-label="card-number"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Label>Cardholder name</Label>
                        <Input
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Expiry (MM/YY)</Label>
                          <Input
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            maxLength={7}
                          />
                        </div>
                        <div>
                          <Label>CVV</Label>
                          <Input
                            placeholder="123"
                            value={cvv}
                            onChange={(e) =>
                              setCvv(e.target.value.replace(/\D/g, ''))
                            }
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      We use secure encryption to store card details. Never
                      shared.
                    </div>
                  </div>
                )}

                {method === 'upi' && (
                  <div className="grid gap-3">
                    <Label>UPI ID</Label>
                    <Input
                      placeholder="yourid@bank / yourid@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      aria-label="upi-id"
                    />
                    <div className="text-xs text-slate-500">
                      You will be redirected to your UPI app to complete the
                      payment.
                    </div>
                  </div>
                )}

                {method === 'wallet' && (
                  <div className="grid gap-3">
                    <Label>Select Wallet</Label>
                    <div className="flex flex-wrap gap-3">
                      {['Paytm', 'PhonePe', 'MobiKwik'].map((w) => (
                        <button
                          key={w}
                          onClick={() => setWalletOption(w)}
                          className={`px-4 py-2 rounded-lg border ${
                            walletOption === w
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">
                      You will be redirected to the wallet app to confirm
                      payment.
                    </div>
                  </div>
                )}

                {method === 'cash' && (
                  <div className="grid gap-2">
                    <div className="text-sm">Cash on arrival</div>
                    <div className="text-xs text-slate-500">
                      Pay at the counter or to the delivery agent when
                      applicable.
                    </div>
                  </div>
                )}
              </div>

              {/* <Separator /> */}
              <div className="h-1 bg-gray-200"></div>

              {/* Terms and Pay button */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input
                    id="tos"
                    type="checkbox"
                    checked={agreeTOS}
                    onChange={(e) => setAgreeTOS(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="tos" className="text-sm text-slate-700">
                    I agree to the{' '}
                    <span className="underline">terms & conditions</span>.
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-700">Total</div>
                  <div className="text-xl font-semibold">₹5,185.00</div>
                  <Button
                    disabled={!isPayEnabled}
                    onClick={handlePay}
                    className="ml-3 px-6 py-3 rounded-xl"
                  >
                    {remaining <= 0
                      ? 'Session expired'
                      : `Confirm & Pay ₹5,185.00`}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Small note / promo area */}
          <div className="mt-4 text-sm text-slate-600">
            <p>
              Need help? <a className="underline">Contact support</a> or try
              another payment method. For security, your session will expire
              after 10 minutes and the booking will be released.
            </p>
          </div>
        </div>

        {/* Right: Booking summary */}
        <aside>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Booking Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="text-sm text-slate-600">New Delhi → Mumbai</div>
              <div className="text-xs text-slate-500">Sat, Oct 4 • 2h 20m</div>

              {/* <Separator /> */}

              <div className="h-1 bg-gray-200"></div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-700">Prepay online</div>
                <div className="font-medium">₹5,185.00</div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-slate-500">Payment session</div>
                <div className="text-sm font-medium">{remainingText} left</div>
              </div>

              {/* <Separator /> */}

              <div className="h-1 bg-gray-200"></div>

              <div className="text-xs text-slate-500">Price breakdown</div>
              <div className="flex justify-between text-sm">
                <div>Base fare</div>
                <div>₹4,200.00</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Taxes & fees</div>
                <div>₹985.00</div>
              </div>

              {/* <Separator /> */}

              <div className="h-1 bg-gray-200"></div>

              <div className="pt-2">
                <Button variant="ghost" className="w-full">
                  Show details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* quick actions */}
          <div className="mt-4 grid gap-3">
            <button className="w-full py-3 rounded-lg border border-gray-200 bg-white">
              Save booking
            </button>
            <button className="w-full py-3 rounded-lg border border-gray-200 bg-white">
              Change seats
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
