import { useState, useEffect, useRef } from 'react';
import {
  commitToWorkbench,
  postCommitToWorkbench,
  toTitleCase,
} from '../../components/helpers';
import {Navbar} from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer"
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const BookingConfirmation = () => {
  const [animate, setAnimate] = useState(false);
  const [pnrModal, setPnrModal] = useState<{
    open: boolean;
    data: any[];
    message?: string;
  }>({ open: false, data: [], message: '' });

  const location = useLocation();

  const [finalResponse, setFinalResponse] = useState<any>(null);
  const [flightSegments, setFlightSegments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guard to avoid calling PNR generation more than once (React Strict Mode/dev double-mount)
  const pnrGeneratedRef = useRef(false);

  const passengers = JSON.parse(sessionStorage.getItem('travelers') || '{}');

  // Animation effect on mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Extract flight segments from response
  useEffect(() => {
    if (finalResponse) {
      const segments =
        finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]?.Product?.flatMap(
          (product: any) => product?.FlightSegment || []
        ) || [];
      setFlightSegments(segments);
    }
  }, [finalResponse]);

  useEffect(() => {
    const workbenchId =
      location.state?.workbench_id ||
      sessionStorage.getItem('workbench_id') ||
      '';

    // Prevent duplicate invocations (covers React Strict Mode double mounting in dev)
    if (pnrGeneratedRef.current) return;

    if (
      workbenchId &&
      (finalResponse === null ||
        !finalResponse?.ReservationResponse?.Identifier?.value)
    ) {
      pnrGeneratedRef.current = true;
      handleGeneratePNR(workbenchId);
    } else {
      setError('Invalid booking reference. Please try again.');
      setIsLoading(false);
    }
  }, []);

  const bookingDetails = {
    bookingId: 'TB-2025-891247',
    destination: 'Bali, Indonesia',
    hotel: 'Alila Ubud Resort',
    checkIn: 'Dec 15, 2025 • 2:00 PM',
    checkOut: 'Dec 22, 2025 • 11:00 AM',
    guests: '2 Adults',
    roomType: 'Deluxe Ocean View',
    roomCharges: 1400.0,
    serviceFee: 98.0,
    taxes: 112.0,
    total: 1610.0,
    paymentMethod: '•••• 3456',
    transactionId: 'TXN891247B23',
  };

  const nextSteps = [
    {
      title: 'Check Your Email',
      description:
        'Your booking confirmation and voucher have been sent to your registered email address.',
    },
    {
      title: 'Download TravelBooking App',
      description:
        'Access your booking anytime and get real-time updates on your trip.',
    },
    {
      title: 'Prepare for Your Trip',
      description:
        'Check visa requirements, weather forecast, and local attractions in Bali.',
    },
    {
      title: 'Arrive & Enjoy',
      description:
        'Show your booking confirmation at the hotel reception and start your vacation!',
    },
  ];

  const handleGeneratePNR = async (workbench_id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!workbench_id) {
        throw new Error('Invalid workbench ID');
      }

      const commitParams = {
        '@type': 'ReservationQueryCommitReservation',
        ReservationQueryCommitReservation: {
          scheduleChangeAcceptedInd: true,
        },
      };

      // Retry loop for transient 'previous transaction in progress' responses
      const maxRetries = 5;
      let attempts = 0;
      const baseDelay = 1000; // ms
      let commitRes: any = null;

      const isRetryableCommitError = (res: any) => {
        const errors: any[] =
          res?.ReservationResponse?.Result?.Error ||
          res?.ReservationResponse?.Result?.Errors ||
          [];
        return errors.some((e: any) => {
          const msg = (e?.Message || '').toString().toUpperCase();
          return (
            msg.includes('TRANSACTION CANNOT BE PROCESSED') ||
            msg.includes('PREVIOUS TRANSACTION IS IN PROGRESS')
          );
        });
      };

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        commitRes = await commitToWorkbench({
          workbench_id,
          params: commitParams,
        });

        attempts++;

        // If API returned null or undefined, consider it a failure (no retry)
        if (!commitRes) break;

        // If we have a retryable error, wait and retry
        if (isRetryableCommitError(commitRes)) {
          const wait = baseDelay * Math.pow(2, attempt); // exponential backoff
          console.warn(
            `Commit attempt ${attempt + 1} failed with 'previous transaction in progress'. Retrying in ${wait}ms`
          );
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }

        // Otherwise break and handle response
        break;
      }

      if (!commitRes && attempts >= maxRetries) {
        throw new Error('Failed to commit booking (no response)');
      }

      // Log any warnings (non-fatal)
      const warnings =
        commitRes?.ReservationResponse?.Warning ||
        commitRes?.ReservationResponse?.Result?.Warning ||
        [];
      if (Array.isArray(warnings) && warnings.length > 0) {
        console.info('Commit returned warnings:', warnings);
        // You may want to surface warnings to the user instead of failing.
      }

      // Try to find a locator robustly
      const locator =
        commitRes?.ReservationResponse?.Reservation?.Receipt?.[0]?.Confirmation
          ?.Locator?.value ||
        commitRes?.ReservationResponse?.Reservation?.Receipt?.[0]?.Confirmation
          ?.Locator ||
        commitRes?.ReservationResponse?.Reservation?.Offer?.[0]?.Identifier
          ?.value ||
        null;

      if (!locator && attempts >= maxRetries) {
        // If there are errors in the Result that are not retryable, surface them
        const errors = commitRes?.ReservationResponse?.Result?.Error || [];
        if (Array.isArray(errors) && errors.length > 0) {
          const messages = errors
            .map((e: any) => e?.Message || JSON.stringify(e))
            .join(' | ');
          throw new Error(messages || 'Commit returned errors and no locator');
        }

        throw new Error('Booking failed to return a locator');
      }

      const finalRes = await postCommitToWorkbench({
        locator,
        params: {},
      });

      // if (
      //   finalResponse != null &&
      //   finalResponse?.ReservationResponse?.Identifier?.value
      // )
      setFinalResponse(finalRes);

      setPnrModal({
        open: true,
        data: finalRes?.ReservationResponse?.Reservation?.Receipt || [],
        message: 'Here is your booking confirmation!',
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMsg);
      console.error('PNR Generation Error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // if (!finalResponse)
  //   handleGeneratePNR(
  //     location.state.workbench_id ||
  //       sessionStorage.getItem('workbench_id') ||
  //       ''
  //   ).then(() => {
  //     finalResponse
  //       ? console.log('PNR generation process completed.')
  //       : handleGeneratePNR(
  //           location.state.workbench_id ||
  //             sessionStorage.getItem('workbench_id') ||
  //             ''
  //         );
  //   });

  const handleDownload = () => {
    alert(
      '📄 Your itinerary PDF is being downloaded...\n\nThis would typically generate and download a PDF with all your booking details, hotel information, and travel tips.'
    );
  };

  const handleContact = (method: string) => {
    const messages: Record<string, string> = {
      chat: '💬 Opening live chat support...',
      email: '📧 Opening email client to support@travelbooking.com...',
      phone: '📞 Our 24/7 support number: +1-800-TRAVEL-24',
    };
    alert(messages[method] || 'Contact method not recognized.');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-5 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-24 h-24 rounded-full bg-red-100 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Booking Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() =>
              !finalResponse ? window.location.reload() : setError(null)
            }
            className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white py-3 px-6 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-5 -mb-5">
      <div className="max-w-5xl mx-auto">
        {/* Success Header */}
        <div
          className={`bg-white rounded-2xl shadow-2xl mb-8 text-center transition-all duration-600 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
        >
          <div className="pt-14 pb-14 px-8">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 mx-auto mb-6 flex items-center justify-center transition-transform duration-500 ${animate ? 'scale-100' : 'scale-0'}`}
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-gray-600 text-lg mb-5 max-w-2xl mx-auto leading-relaxed">
              Your payment was successful and your booking has been confirmed.
              <br />
              Get ready for an amazing journey!
            </p>
            <div className="inline-block bg-purple-50 text-[#BC1110] px-6 py-3 rounded-full font-bold text-base">
              Booking ID: {bookingDetails.bookingId}
            </div>
            {pnrModal?.data?.length > 0
              ? pnrModal?.data?.map((receipt, index) => (
                  <div
                    key={index}
                    className="inline-block bg-purple-50 text-[#BC1110] px-6 py-3 rounded-full font-bold text-base"
                  >
                    PNR {receipt?.Confirmation?.Locator?.source}:{' '}
                    {receipt?.Confirmation?.Locator?.value
                      ? receipt?.Confirmation?.Locator?.value
                      : bookingDetails.bookingId}
                  </div>
                ))
              : isLoading && 'Generating PNR...'}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Trip Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
              <span className="text-3xl">🏨</span>
              Trip Details
            </h2>
            <div className="space-y-4">
              <InfoRow
                label="Departure City"
                value={
                  sessionStorage.getItem('fromCity')?.split('-')?.[0]?.trim() ||
                  '...'
                }
              />
              <InfoRow
                label="Arrival City"
                value={
                  sessionStorage.getItem('toCity')?.split('-')?.[0]?.trim() ||
                  '...'
                }
              />
              <InfoRow
                label="Trip Type"
                value={
                  toTitleCase(
                    sessionStorage.getItem('tripType')?.replace('-', ' ') || ''
                  ) || '...'
                }
              />
              <InfoRow
                label="Cabin"
                value={
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Product?.[0]?.PassengerFlight?.[0]?.FlightProduct?.[0]
                    ?.cabin || '...'
                }
              />
              <InfoRow
                label="Departure"
                value={
                  `${dayjs(flightSegments?.[0]?.Flight?.Departure?.date || sessionStorage.getItem('onwardDate')).format('ddd, DD MMM YYYY') || '...'} • ${flightSegments?.[0]?.Flight?.Departure?.time?.slice(0, 5) || '...'}` ||
                  '...'
                }
              />
              <InfoRow
                label="Arrival"
                value={
                  `${dayjs(flightSegments?.[flightSegments?.length - 1]?.Flight?.Arrival?.date || sessionStorage.getItem('returnDate')).format('ddd, DD MMM YYYY') || '...'} • ${flightSegments?.[flightSegments?.length - 1]?.Flight?.Arrival?.time?.slice(0, 5) || '...'}` ||
                  '...'
                }
              />
              <InfoRow
                label="Passengers"
                value={
                  `${passengers.adults + passengers.children + passengers.infants}` ||
                  '...'
                }
              />
              <InfoRow
                label="Cabin Type"
                value={
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Product?.[0]?.PassengerFlight?.[0]?.FlightProduct?.[0]
                    ?.Brand?.name || '...'
                }
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full mt-6 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white py-3 px-6 rounded-xl font-semibold transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Itinerary
            </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
              <span className="text-3xl">💳</span>
              Payment Summary
            </h2>
            <div className="space-y-4">
              <InfoRow
                label="Base Charges"
                // value={`$${bookingDetails.roomCharges.toFixed(2)}`}
                value={`${
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Price?.CurrencyCode?.value || '...'
                } ${
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Price?.Base || '...'
                }`}
              />
              <InfoRow
                label="Taxes"
                // value={`$${bookingDetails.serviceFee.toFixed(2)}`}
                value={`${
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Price?.CurrencyCode?.value || '...'
                } ${
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Price?.TotalTaxes || '...'
                }`}
              />
              <InfoRow
                label="Service Fee"
                // value={`$${bookingDetails.taxes.toFixed(2)}`}
                value={`${
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Price?.CurrencyCode?.value || '...'
                } ${
                  finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                    ?.Price?.TotalFees || 0
                }`}
              />
              <div className="border-t-2 border-blue-600 pt-4 mt-4">
                <InfoRow
                  label="Total Paid"
                  // value={`$${bookingDetails.total.toFixed(2)}`}
                  value={`${
                    finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                      ?.Price?.CurrencyCode?.value || '...'
                  } ${
                    finalResponse?.ReservationResponse?.Reservation?.Offer?.[0]
                      ?.Price?.TotalPrice || '...'
                  }`}
                  highlight
                />
              </div>
              <InfoRow
                label="Payment Method"
                value={bookingDetails.paymentMethod}
              />
              <InfoRow
                label="Transaction ID"
                // value={bookingDetails.transactionId}
                value={
                  finalResponse?.ReservationResponse?.Identifier?.value || '...'
                }
              />
            </div>
            <div className="mt-6 bg-gradient-to-r from-yellow-400 to-blue-900 text-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>📧</span>
                Confirmation Sent
              </h3>
              <p className="text-sm opacity-95">
                We've sent your booking confirmation and e-tickets to your email
                address.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
            <span className="text-3xl">📍</span>
            What's Next?
          </h2>
          <div className="relative pl-10">
            {nextSteps.map((step, index) => (
              <div key={index} className="relative pb-8 last:pb-0">
                <div className="absolute left-[-29px] top-2 w-4 h-4 rounded-full bg-purple-600 border-4 border-white shadow-[0_0_0_2px_rgb(124,58,237)]" />
                {index !== nextSteps.length - 1 && (
                  <div className="absolute left-[-22px] top-6 w-0.5 h-[calc(100%-8px)] bg-gray-200" />
                )}
                <div>
                  <div className="font-bold text-gray-900 mb-1 text-base">
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
            <span className="text-3xl">💬</span>
            Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is available 24/7 to assist you with any
            questions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactCard
              icon="💬"
              label="Live Chat"
              onClick={() => handleContact('chat')}
            />
            <ContactCard
              icon="📧"
              label="Email Support"
              onClick={() => handleContact('email')}
            />
            <ContactCard
              icon="📞"
              label="Call Us"
              onClick={() => handleContact('phone')}
            />
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl shadow-xl text-center p-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl">🎁</span>
            <h3 className="text-2xl font-bold">Thank You for Booking!</h3>
          </div>
          <p className="mb-4 text-base opacity-95">
            Here's 15% off your next booking with us
          </p>
          <div className="inline-block bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-2xl tracking-wider mb-4">
            TRAVEL15
          </div>
          <p className="text-sm opacity-90">Valid until January 31, 2026</p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: any;
  value: any;
  highlight?: boolean | undefined;
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
    <span
      className={`text-sm ${highlight ? 'font-bold text-red-600 text-base' : 'text-gray-600'}`}
    >
      {label}
    </span>
    <span
      className={`text-sm font-semibold text-right ${highlight ? 'text-red-600 text-lg' : 'text-gray-900'}`}
    >
      {value}
    </span>
  </div>
);

const ContactCard = ({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: any;
  onClick?: (() => void) | undefined;
}) => (
  <div
    onClick={onClick}
    className="bg-gray-50 hover:bg-purple-50 p-6 rounded-xl text-center transition-all cursor-pointer hover:-translate-y-2 hover:shadow-lg"
  >
    <div className="text-5xl mb-3">{icon}</div>
    <div className="text-sm font-semibold text-gray-700">{label}</div>
  </div>
);

export default BookingConfirmation;
