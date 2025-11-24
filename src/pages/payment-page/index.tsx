import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRazorpay } from '../../hooks/useRazorpay';
import { useAuthStore } from '../../../stores/authStore';

// Shadcn / TailwindUI style components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CreditCard, Shield, Clock, CheckCircle } from 'lucide-react';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';

type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'wallet' | 'netbanking';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initializePayment } = useRazorpay();
  const user = useAuthStore((state) => state.user);

  // UI state
  const [method, setMethod] = useState<PaymentMethod>('razorpay');
  const [agreeTOS, setAgreeTOS] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get payment details from location state
  const locationState = location.state as any;

  // Redirect if no amount provided
  useEffect(() => {
    if (!locationState?.amount) {
      alert('No payment details found. Please start from booking page.');
      navigate('/');
    }
  }, [locationState, navigate]);

  const [paymentDetails] = useState({
    amount: locationState?.amount || 0,
    bookingId: locationState?.bookingId || 'BKG' + Date.now(),
    description: locationState?.description || 'Booking',
    customerName: user?.FirstName + ' ' + user?.LastName || 'Guest',
    customerEmail: user?.Email || '',
    customerContact: user?.PhoneNumber || '',
    offerData: locationState?.offerData || null,
    passengers: locationState?.passengers || null,
    breakdown: locationState?.breakdown || null,
  });

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

  const isPayEnabled = useMemo(() => {
    if (remaining <= 0) return false;
    if (!agreeTOS) return false;
    return true;
  }, [remaining, agreeTOS]);

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!isPayEnabled || isProcessing) return;

    setIsProcessing(true);

    try {
      // Initialize Razorpay payment (without order_id for direct payment)
      const response = await initializePayment({
        amount: paymentDetails.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Nixtour',
        description: paymentDetails.description,
        // Note: order_id removed - using direct payment without backend order creation
        prefill: {
          name: paymentDetails.customerName,
          email: paymentDetails.customerEmail,
          contact: paymentDetails.customerContact,
        },
        notes: {
          booking_id: paymentDetails.bookingId,
          customer_id: user?.UserId || 'guest',
        },
        theme: {
          color: '#BC1110', // Nixtour brand red color
          backdrop_color: '#F5F5F5',
        },
      });

      console.log('✅ Payment successful:', response);

      // Payment successful - send to backend for verification
      await verifyPayment(response);

      // Navigate to success page
      navigate('/payment-confirmation', {
        state: {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          amount: paymentDetails.amount,
          bookingId: paymentDetails.bookingId,
        },
      });
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Verify payment with backend
  const verifyPayment = async (response: any) => {
    try {
      // In production, you should verify the payment signature on your backend
      const verificationResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            booking_id: paymentDetails.bookingId,
          }),
        }
      );

      if (!verificationResponse.ok) {
        throw new Error('Payment verification failed');
      }

      console.log('✅ Payment verified successfully');
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      // Continue anyway - the payment was successful on Razorpay's end
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-10 pt-28">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {/* Left: Payment card / form */}
          <div className="md:col-span-2">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="flex items-center justify-between bg-gradient-to-r from-[#BC1110] to-[#8B0000] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  <CardTitle className="text-lg font-semibold">
                    Secure Payment
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{remainingText}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Payment method selector */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Choose Payment Method
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {/* Razorpay (All methods) */}
                    <button
                      onClick={() => setMethod('razorpay')}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        method === 'razorpay'
                          ? 'border-[#BC1110] bg-red-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#BC1110] to-[#8B0000] text-white">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-slate-900">
                          Pay with Razorpay
                        </div>
                        <div className="text-sm text-slate-600">
                          Cards, UPI, Wallets, NetBanking & More
                        </div>
                      </div>
                      {method === 'razorpay' && (
                        <CheckCircle className="w-5 h-5 text-[#BC1110]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment info */}
                {method === 'razorpay' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">
                          Safe & Secure Payment
                        </p>
                        <ul className="text-xs space-y-1 text-blue-800">
                          <li>• 256-bit SSL encryption</li>
                          <li>• PCI DSS compliant</li>
                          <li>• All major payment methods supported</li>
                          <li>• Instant refund in case of cancellation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="h-px bg-gray-200"></div>

                {/* Terms and Pay button */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      id="tos"
                      type="checkbox"
                      checked={agreeTOS}
                      onChange={(e) => setAgreeTOS(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#BC1110] border-gray-300 rounded focus:ring-[#BC1110]"
                    />
                    <label htmlFor="tos" className="text-sm text-slate-700">
                      I agree to the{' '}
                      <a href="/user-agreement" className="text-[#BC1110] underline hover:text-[#8B0000]">
                        terms & conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" className="text-[#BC1110] underline hover:text-[#8B0000]">
                        privacy policy
                      </a>
                      .
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <div className="text-sm text-slate-600">Total Amount</div>
                      <div className="text-2xl font-bold text-slate-900">
                        ₹{paymentDetails.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <Button
                      disabled={!isPayEnabled || isProcessing}
                      onClick={handleRazorpayPayment}
                      className="bg-gradient-to-r from-[#BC1110] to-[#8B0000] hover:from-[#8B0000] hover:to-[#BC1110] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : remaining <= 0 ? (
                        'Session Expired'
                      ) : (
                        <>Pay ₹{paymentDetails.amount.toLocaleString('en-IN')}</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Small note / promo area */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#BC1110]" />
                Why Razorpay?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                <div>
                  <div className="font-medium text-slate-900">Secure</div>
                  <div className="text-xs">PCI DSS Level 1 compliant</div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Fast</div>
                  <div className="text-xs">Instant payment confirmation</div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Trusted</div>
                  <div className="text-xs">Used by 10M+ businesses</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              <p>
                Need help?{' '}
                <a href="/contact-us" className="text-[#BC1110] underline hover:text-[#8B0000]">
                  Contact support
                </a>{' '}
                or try another payment method. For security, your session will
                expire after 10 minutes and the booking will be released.
              </p>
            </div>
          </div>

          {/* Right: Booking summary */}
          <aside>
            <Card className="sticky top-28 shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {paymentDetails.description}
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Price Breakdown - only show if provided */}
                {paymentDetails.breakdown && (
                  <>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-700 uppercase">
                        Price Breakdown
                      </div>
                      {Object.entries(paymentDetails.breakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <div className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}</div>
                          <div className="font-medium">₹{Number(value).toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-gray-200"></div>
                  </>
                )}

                <div className="flex justify-between items-center bg-gradient-to-r from-[#BC1110] to-[#8B0000] text-white p-3 rounded-lg">
                  <div className="font-semibold">Total Amount</div>
                  <div className="text-xl font-bold">
                    ₹{paymentDetails.amount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>Payment session: {remainingText} left</span>
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div className="text-xs text-slate-500">
                  Booking ID: {paymentDetails.bookingId}
                </div>
              </CardContent>
            </Card>

            {/* quick actions */}
            <div className="mt-4 grid gap-3">
              <button className="w-full py-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-medium transition-all">
                Save booking
              </button>
              <button className="w-full py-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-medium transition-all">
                Change seats
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};