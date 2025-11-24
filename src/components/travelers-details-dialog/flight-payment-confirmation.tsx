import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
// import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Plane,
  Luggage,
  Users,
  IndianRupee,
  AlertCircle,
  Clock,
  ArrowRight,
  Edit,
  MapPin,
} from 'lucide-react';

export const PaymentConfirmationModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerData: any;
  passengers: any;
  onProceedToPayment: () => void;
  onEditPassengers: () => void;
}> = ({
  open,
  onOpenChange,
  offerData,
  passengers,
  onProceedToPayment,
  onEditPassengers,
}) => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  console.log(offerData);

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (
    amount: string | number,
    currency: string = 'INR'
  ) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount as number);
  };

  const getPassengerTypeLabel = (type: string) => {
    const types: any = {
      ADT: 'Adult',
      CHD: 'Child',
      INF: 'Infant',
    };
    return types[type] || type;
  };

  const terms =
    offerData?.OfferListResponse?.OfferID?.[0]?.TermsAndConditionsFull[0];
  const baggageInfo = terms.BaggageAllowance;
  const penalties = terms.Penalties[0];

  const checkedBaggage = baggageInfo.filter((b: any) =>
    b.baggageType.includes('CheckedBag')
  );
  const carryOnBaggage = baggageInfo.filter(
    (b: any) => b.baggageType === 'CarryOn'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:w-[95vw] max-w-6xl max-h-[95vh] sm:h-[90vh] p-0 gap-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
        <div className="flex flex-col h-full overflow-hidden">
          <DialogHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3 border-b shrink-0">
            <DialogTitle className="text-base sm:text-xl md:text-2xl font-bold">
              Confirm Booking Details
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Review all details before payment
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden px-3 sm:px-6 py-2 sm:py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
            <Tabs defaultValue="flight" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-5 shrink-0 h-8 sm:h-10 mb-2 sm:mb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
                <TabsTrigger
                  value="flight"
                  className="text-xs sm:text-sm px-1 sm:px-3"
                >
                  <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Flight</span>
                </TabsTrigger>
                <TabsTrigger
                  value="passengers"
                  className="text-xs sm:text-sm px-1 sm:px-3"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Passengers</span>
                </TabsTrigger>
                <TabsTrigger
                  value="baggage"
                  className="text-xs sm:text-sm px-1 sm:px-3"
                >
                  <Luggage className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Bag</span>
                </TabsTrigger>
                <TabsTrigger
                  value="price"
                  className="text-xs sm:text-sm px-1 sm:px-3"
                >
                  <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Price</span>
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="text-xs sm:text-sm px-1 sm:px-3"
                >
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Terms</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
                {/* Flight Segments */}

                <TabsContent
                  value="flight"
                  className="space-y-2 sm:space-y-4 mt-0 h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
                >
                  {offerData?.OfferListResponse?.OfferID?.[0]?.Product?.map(
                    (product: any, idx: number) => (
                      <div key={idx} className="space-y-2 sm:space-y-3">
                        <h3 className="font-semibold text-xs sm:text-base md:text-lg">
                          {idx === 0 ? 'Outbound' : 'Return'} Flight
                        </h3>
                        {product?.FlightSegment.map(
                          (segment: any, segIdx: number) => (
                            <div
                              key={segment.id}
                              className="border rounded-lg p-2 sm:p-4 space-y-2 sm:space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                  <Plane className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
                                  <span className="font-semibold text-xs sm:text-base">
                                    {segment?.Flight?.operatingCarrierName}{' '}
                                    {segment?.Flight?.carrier}-
                                    {segment?.Flight?.number}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({segment?.Flight?.equipment})
                                  </span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {formatDuration(segment?.Flight?.duration)}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                <div className="space-y-0.5 sm:space-y-1">
                                  <div className="text-xs text-gray-500">
                                    Departure
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                    <MapPin className="w-3 h-3 text-green-600" />
                                    <span className="font-semibold text-sm sm:text-lg">
                                      {segment?.Flight?.Departure?.location}
                                    </span>
                                    {segment.Flight.Departure.terminal && (
                                      <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                        T{segment?.Flight?.Departure?.terminal}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {formatDateTime(
                                      segment?.Flight?.Departure?.date,
                                      segment?.Flight?.Departure?.time
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-0.5 sm:space-y-1">
                                  <div className="text-xs text-gray-500">
                                    Arrival
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                    <MapPin className="w-3 h-3 text-red-600" />
                                    <span className="font-semibold text-sm sm:text-lg">
                                      {segment?.Flight?.Arrival?.location}
                                    </span>
                                    {segment?.Flight?.Arrival?.terminal && (
                                      <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                        T{segment?.Flight?.Arrival?.terminal}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {formatDateTime(
                                      segment?.Flight?.Arrival?.date,
                                      segment?.Flight?.Arrival?.time
                                    )}
                                  </div>
                                </div>
                              </div>

                              {segment?.connectionDuration &&
                                segIdx < product?.FlightSegment?.length - 1 && (
                                  // <Alert className="bg-blue-50 border-blue-200 py-2">
                                  //   <Clock className="h-3 w-3 text-blue-600" />
                                  //   <AlertDescription className="text-blue-800 text-xs">
                                  //     Layover: {formatDuration(segment.connectionDuration)}
                                  //   </AlertDescription>
                                  // </Alert>
                                  <div className="bg-blue-50 border-blue-200 py-2 flex gap-2 px-1">
                                    <Clock className="h-3 w-3 text-blue-600" />
                                    <div className="text-blue-800 text-xs">
                                      Layover:{' '}
                                      {formatDuration(
                                        segment?.connectionDuration
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    )
                  )}
                </TabsContent>

                {/* Passengers */}

                <TabsContent
                  value="passengers"
                  className="space-y-2 sm:space-y-4 mt-0 h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-xs sm:text-base md:text-lg">
                      Passengers ({passengers?.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onEditPassengers}
                      className="gap-1 h-7 sm:h-9 text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                  </div>

                  {passengers?.map((passenger: any, idx: number) => (
                    <div
                      key={passenger?.id || idx}
                      className="border rounded-lg p-2 sm:p-4 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <Users className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
                          <span className="font-semibold text-xs sm:text-base">
                            Passenger {idx + 1}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            {getPassengerTypeLabel(passenger?.type)}
                          </span>
                        </div>
                        {passenger?.seatId && (
                          <span className="text-xs text-gray-500">
                            Seat: {passenger?.seatId}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Name: </span>
                          <span className="font-medium">
                            {passenger?.title} {passenger?.first_name}{' '}
                            {passenger?.last_name}
                          </span>
                        </div>
                        {passenger?.dob && (
                          <div>
                            <span className="text-gray-500">DOB: </span>
                            <span className="font-medium">
                              {passenger?.dob}
                            </span>
                          </div>
                        )}
                        {passenger?.passport_number && (
                          <>
                            <div>
                              <span className="text-gray-500">Passport: </span>
                              <span className="font-medium">
                                {passenger?.passport_number}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Expiry: </span>
                              <span className="font-medium">
                                {passenger?.passport_expiry}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Nationality:{' '}
                              </span>
                              <span className="font-medium">
                                {passenger?.nationality}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Issuing: </span>
                              <span className="font-medium">
                                {passenger?.issuing_country}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Baggage */}

                <TabsContent
                  value="baggage"
                  className="space-y-2 sm:space-y-4 mt-0 h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
                >
                  <div>
                    <h3 className="font-semibold text-xs sm:text-base md:text-lg mb-2 flex items-center gap-2">
                      <Luggage className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
                      Checked Baggage
                    </h3>
                    <div className="space-y-2">
                      {checkedBaggage?.map((bag: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-2 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="space-y-0.5 sm:space-y-1 flex-1">
                              <div className="font-medium text-xs sm:text-base capitalize">
                                {bag?.baggageType
                                  ?.replace(/([A-Z])/g, ' $1')
                                  .trim()}
                              </div>
                              <div className="text-xs text-gray-600">
                                {bag?.BaggageItem[0]?.Text}
                              </div>
                              {bag?.BaggageItem?.[0]?.quantity && (
                                <div className="text-xs text-gray-500">
                                  Qty: {bag?.BaggageItem?.[0]?.quantity} pc
                                </div>
                              )}
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              {bag?.BaggageItem?.[0]?.includedInOfferPrice ===
                              'Yes' ? (
                                <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded inline-block">
                                  Included
                                </span>
                              ) : (
                                <div className="space-y-0.5">
                                  <span className="text-orange-600 font-medium text-xs bg-orange-50 px-2 py-1 rounded block">
                                    Extra
                                  </span>
                                  {bag?.BaggageItem?.[0]?.BaggageFee && (
                                    <div className="text-xs font-semibold">
                                      {formatCurrency(
                                        bag?.BaggageItem?.[0]?.BaggageFee
                                          ?.value,
                                        bag?.BaggageItem?.[0]?.BaggageFee?.code
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xs sm:text-base md:text-lg mb-2 flex items-center gap-2">
                      <Luggage className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600" />
                      Carry-On
                    </h3>
                    <div className="space-y-2">
                      {carryOnBaggage.map((bag: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-2 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="space-y-0.5 flex-1">
                              <div className="font-medium text-xs sm:text-base">
                                Cabin Baggage
                              </div>
                              {bag?.BaggageItem?.[0]?.Measurement && (
                                <div className="text-xs text-gray-600">
                                  Up to{' '}
                                  {bag.BaggageItem[0].Measurement?.[0]?.value}{' '}
                                  {bag.BaggageItem[0].Measurement?.[0]?.unit}
                                </div>
                              )}
                              <div className="text-xs text-gray-500">
                                {bag?.BaggageItem?.[0]?.Text}
                              </div>
                            </div>
                            <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded inline-block shrink-0">
                              Included
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Price Breakdown */}

                <TabsContent
                  value="price"
                  className="space-y-2 sm:space-y-4 mt-0 h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
                >
                  <div className="border rounded-lg p-2 sm:p-4 space-y-2">
                    <h3 className="font-semibold text-xs sm:text-base md:text-lg">
                      Price Breakdown
                    </h3>

                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-medium">
                          {formatCurrency(
                            offerData?.OfferListResponse?.OfferID?.[0]?.Price
                              ?.Base,
                            offerData?.OfferListResponse?.OfferID?.[0]?.Price
                              ?.CurrencyCode?.value
                          )}
                        </span>
                      </div>

                      <div className="border-t pt-1.5 sm:pt-2 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
                        <div className="flex justify-between text-xs sm:text-sm font-medium">
                          <span className="text-gray-600">Taxes & Fees</span>
                          <span>
                            {formatCurrency(
                              offerData?.OfferListResponse?.OfferID?.[0]?.Price
                                ?.TotalTaxes,
                              offerData?.OfferListResponse?.OfferID?.[0]?.Price
                                ?.CurrencyCode?.value
                            )}
                          </span>
                        </div>

                        <div className="max-h-32 overflow-y-auto space-y-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
                          {offerData?.OfferListResponse?.OfferID?.[0]?.Price?.PriceBreakdown?.[0]?.Amount?.Taxes?.Tax?.map(
                            (tax: any, idx: number) => {
                              return (
                                <div
                                  key={idx}
                                  className="flex justify-between text-xs text-gray-500 pl-2"
                                >
                                  <span className="truncate pr-2">
                                    {tax?.description || tax?.taxCode}
                                  </span>
                                  <span className="shrink-0">
                                    {formatCurrency(
                                      tax?.value,
                                      offerData?.OfferListResponse?.OfferID?.[0]
                                        ?.Price?.CurrencyCode?.value
                                    )}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-1.5 sm:pt-2 flex justify-between font-bold text-sm sm:text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">
                          {formatCurrency(
                            offerData?.OfferListResponse?.OfferID?.[0]?.Price
                              ?.TotalPrice,
                            offerData?.OfferListResponse?.OfferID?.[0]?.Price
                              ?.CurrencyCode?.value
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Terms & Conditions */}

                <TabsContent
                  value="terms"
                  className="space-y-2 sm:space-y-4 mt-0 h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
                >
                  <div className="bg-yellow-50 border-yellow-200 py-2">
                    <Clock className="h-3 w-3 text-yellow-600" />
                    <div className="text-yellow-800 text-xs">
                      <strong>Pay by:</strong>{' '}
                      {new Date(terms?.PaymentTimeLimit).toLocaleString(
                        'en-IN'
                      )}
                    </div>
                  </div>

                  <div className="border rounded-lg p-2 sm:p-4 space-y-2">
                    <h3 className="font-semibold text-xs sm:text-base md:text-lg">
                      Change & Cancellation
                    </h3>

                    {penalties?.Change && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-gray-700">
                          Change Fee:
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-orange-600">
                          {formatCurrency(
                            penalties?.Change?.[0]?.Penalty?.[0]?.Amount?.value,
                            penalties?.Change?.[0].Penalty?.[0]?.Amount?.code
                          )}{' '}
                          per ticket
                        </div>
                      </div>
                    )}

                    {penalties?.Cancel && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-gray-700">
                          Cancellation Fee:
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-red-600">
                          {formatCurrency(
                            penalties?.Cancel?.[0]?.Penalty?.[0]?.Amount?.value,
                            penalties?.Cancel?.[0]?.Penalty?.[0]?.Amount?.code
                          )}{' '}
                          per ticket
                        </div>
                      </div>
                    )}
                  </div>

                  {terms?.Restriction && (
                    <div className="border rounded-lg p-2 sm:p-4 space-y-1.5">
                      <h3 className="font-semibold text-xs sm:text-base md:text-lg">
                        Restrictions
                      </h3>
                      <ul className="space-y-0.5">
                        {terms?.Restriction?.map(
                          (restriction: any, idx: number) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-600 flex items-start gap-1.5"
                            >
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{restriction?.value}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <DialogFooter className="px-3 sm:px-6 py-2 sm:py-4 border-t shrink-0 flex-col gap-2">
            <div className="flex items-start space-x-2 w-full">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={() => setTermsAccepted(!termsAccepted)}
                className="mt-0.5 shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-xs leading-tight cursor-pointer"
              >
                I accept the terms, baggage policies, and cancellation fees.
              </label>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={onEditPassengers}
                className="flex-1 text-xs h-8 sm:h-10"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                // onClick={onProceedToPayment}
                // disabled={!termsAccepted}
                className="flex-1 text-xs h-8 sm:h-10"
              >
                Pay Now
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              <Button
                onClick={onProceedToPayment}
                disabled={!termsAccepted}
                className="flex-1 text-xs h-8 sm:h-10"
              >
                Generate PNR
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// export default function App() {
//   const [open, setOpen] = useState(true);

//   const demoOfferData = {
//     Product: [
//       {
//         FlightSegment: [
//           {
//             id: 's1',
//             sequence: 1,
//             connectionDuration: 'PT2H35M',
//             Flight: {
//               carrier: 'AI',
//               number: '2654',
//               operatingCarrierName: 'Air India',
//               equipment: '32N',
//               duration: 'PT3H',
//               Departure: { location: 'BLR', date: '2025-11-17', time: '07:00:00', terminal: '2' },
//               Arrival: { location: 'DEL', date: '2025-11-17', time: '10:00:00', terminal: '3' },
//             },
//           },
//           {
//             id: 's2',
//             sequence: 2,
//             Flight: {
//               carrier: 'AI',
//               number: '143',
//               operatingCarrierName: 'Air India',
//               equipment: '788',
//               duration: 'PT10H40M',
//               Departure: { location: 'DEL', date: '2025-11-17', time: '12:35:00', terminal: '3' },
//               Arrival: { location: 'CDG', date: '2025-11-17', time: '18:45:00', terminal: '2C' },
//             },
//           },
//         ],
//       },
//       {
//         FlightSegment: [
//           {
//             id: 's3',
//             sequence: 1,
//             connectionDuration: 'PT5H5M',
//             Flight: {
//               carrier: 'AI',
//               number: '148',
//               operatingCarrierName: 'Air India',
//               equipment: '788',
//               duration: 'PT9H',
//               Departure: { location: 'CDG', date: '2025-11-27', time: '11:25:00', terminal: '2C' },
//               Arrival: { location: 'DEL', date: '2025-11-28', time: '00:55:00', terminal: '3' },
//             },
//           },
//           {
//             id: 's4',
//             sequence: 2,
//             Flight: {
//               carrier: 'AI',
//               number: '2409',
//               operatingCarrierName: 'Air India',
//               equipment: '32N',
//               duration: 'PT2H55M',
//               Departure: { location: 'DEL', date: '2025-11-28', time: '06:00:00', terminal: '3' },
//               Arrival: { location: 'BLR', date: '2025-11-28', time: '08:55:00', terminal: '2' },
//             },
//           },
//         ],
//       },
//     ],
//     Price: {
//       CurrencyCode: { value: 'INR' },
//       Base: 81985,
//       TotalTaxes: 36065,
//       TotalFees: 0,
//       TotalPrice: 118050,
//       PriceBreakdown: [
//         {
//           Amount: {
//             Taxes: {
//               Tax: [
//                 { taxCode: 'IN', description: 'USER DEVELOPMENT FEE', value: 1770 },
//                 { taxCode: 'K3', description: 'GST', value: 5011 },
//                 { taxCode: 'P2', description: 'SECURITY FEE', value: 1244 },
//                 { taxCode: 'FR', description: 'SAFETY TAX', value: 2278 },
//                 { taxCode: 'O4', description: 'SOLIDARITY TAX', value: 4086 },
//                 { taxCode: 'QX', description: 'SERVICE CHARGE', value: 3446 },
//                 { taxCode: 'YQ', value: 17570 },
//                 { taxCode: 'YR', value: 660 },
//               ],
//             },
//           },
//         },
//       ],
//     },
//     TermsAndConditionsFull: [
//       {
//         BaggageAllowance: [
//           {
//             baggageType: 'FirstCheckedBag',
//             BaggageItem: [
//               {
//                 quantity: 1,
//                 includedInOfferPrice: 'Yes',
//                 Text: 'UPTO50LB/23KG AND UPTO62LI/158LCM',
//                 BaggageFee: { value: 0, code: 'INR' },
//               },
//             ],
//           },
//           {
//             baggageType: 'SecondCheckedBag',
//             BaggageItem: [
//               {
//                 quantity: 1,
//                 includedInOfferPrice: 'No',
//                 Text: 'EXCESS SIZE',
//                 BaggageFee: { value: 8785, code: 'INR' },
//               },
//             ],
//           },
//           {
//             baggageType: 'CarryOn',
//             BaggageItem: [
//               {
//                 includedInOfferPrice: 'Yes',
//                 Text: 'CHGS MAY APPLY IF EXCEED WT',
//                 Measurement: [{ value: 7, unit: 'Kilograms' }],
//               },
//             ],
//           },
//         ],
//         Penalties: [
//           {
//             Change: [{ Penalty: [{ Amount: { value: 10000, code: 'INR' } }] }],
//             Cancel: [{ Penalty: [{ Amount: { value: 18000, code: 'INR' } }] }],
//           },
//         ],
//         Restriction: [
//           { value: 'NON-END/CHANGE' },
//           { value: 'CANCELLATION/NO-SHOW' },
//           { value: 'PENALTY MAY APPLY' },
//           { value: 'AS PER FARE RULES' },
//         ],
//         PaymentTimeLimit: '2025-11-17T05:00:00Z',
//       },
//     ],
//   };

//   const demoPassengers = [
//     {
//       id: 'p1',
//       type: 'ADT',
//       title: 'Mr',
//       first_name: 'John',
//       last_name: 'Doe',
//       dob: '1990-05-15',
//       passport_number: 'A12345678',
//       passport_expiry: '2030-12-31',
//       nationality: 'Indian',
//       issuing_country: 'India',
//       seatId: '12A',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
//       <PaymentConfirmationModal
//         open={open}
//         onOpenChange={setOpen}
//         offerData={demoOfferData}
//         passengers={demoPassengers}
//         onProceedToPayment={() => {
//           alert('Proceeding to payment...');
//           setOpen(false);
//         }}
//         onEditPassengers={() => {
//           alert('Opening passenger edit form...');
//         }}
//       />
//     </div>
//   );
// }
