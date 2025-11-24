// import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Plane } from 'lucide-react';

import { FlightDetailsDialogProps } from './types';
import dayjs from 'dayjs';
import { ShareScreenshot } from '../share-screenshot';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

// Helpers
const formatTime = (str: string) => str.slice(0, 5); // expect HH:MM:SS
const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
// const minutesToHourMin = (min: number) => {
//   const h = Math.floor(min / 60);
//   const m = min % 60;
//   return `${h}h ${m}m`;
// };

// Main Dialog (controlled)
export const FlightDetailsDialog: React.FC<FlightDetailsDialogProps> = ({
  open,
  onOpenChange,
  data,
  airlines,
}) => {
  console.log('data', data);
  // console.log(airlines);

  const [showFare, setShowFare] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setShowFare(true);
      else setShowFare(false);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Run once on mount in case screen size changed before component loaded
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  function calculateTimeDifference(
    durationStart: any,
    durationEnd: any
  ): string {
    // Convert time strings to Date objects
    const start = new Date(
      `${dayjs(durationStart.date).format('YYYY-MM-DD')}T${durationStart.time}:00Z`
    ); // Assume both times are on the same day
    const end = new Date(
      `${dayjs(durationEnd.date).format('YYYY-MM-DD')}T${durationEnd.time}:00Z`
    );

    // Get the difference in milliseconds
    let difference = end.getTime() - start.getTime();

    // If the durationEnd time is earlier than the start time, adjust for the next day
    if (difference < 0) {
      difference += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }

    // Convert milliseconds to hours and minutes
    const hours = Math.floor(difference / (1000 * 60 * 60)); // Hours
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes

    return `${hours}H ${minutes}M`;
  }

  const flights =
    sessionStorage.getItem('tripType') === 'one-way'
      ? [data?.[0]]
      : [data?.[0]?.[0], data?.[1]?.[0]];

  // console.log('Flight', flights);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Accessibility: DialogContent requires a DialogTitle for screen readers.
          We include a visually-hidden DialogTitle via the DialogHeader component.
          The visible heading further down is kept for visual layout. */}
      <DialogContent className="bg-white max-w-5xl gap-0 w-[95vw] md:w-[90vw] lg:w-[1100px] p-0 rounded-2xl sm:rounded-2xl overflow-hidden border-black">
        <div id="flight-details-with-fare" className=" h-fit w-fit">
          <DialogHeader>
            {/* visually hidden title to satisfy accessibility requirements */}
            <DialogTitle className="sr-only">Flight Details</DialogTitle>
          </DialogHeader>

          <DialogDescription></DialogDescription>

          <div className="flex flex-col md:flex-row max-h-[90dvh] md:min-h-[60vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
            {/* Left - Flight timeline/details */}
            <div
              className="flex-1 p-6 pr-3 md:mx-0 md:p-6 md:pr-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] min-h-[40dvh] max-h-[70dvh]"
              id="flight-details"
            >
              <div className="flex items-start justify-between">
                <div id="flight-dialog-title">
                  <h3 className="text-lg font-semibold">Flight Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Review segments, times and connection notes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4" />
                </Button> */}
                </div>
              </div>

              <ScrollArea className="mt-4 pr-4 w-full">
                {flights?.flatMap((flight: any, index: number) => (
                  <ol key={index} className="space-y-6">
                    {sessionStorage.getItem('tripType') === 'round-trip' && (
                      <div className="my-2 -mb-4 border bg-blue-600 text-white p-2">
                        {index === 0
                          ? 'Onward Flight Details'
                          : 'Return Flight Details'}
                      </div>
                    )}

                    {flight?.flightDetails?.map((s: any, i: number) => (
                      <li
                        key={`${index}-${i}`}
                        className="bg-white shadow-sm rounded-lg p-4 border"
                      >
                        <div className="flex flex-col md:justify-between gap-4">
                          <div className="flex items-center gap-3 w-fit">
                            <div className="rounded-md w-fit">
                              {airlines?.find(
                                (airline: any) =>
                                  airline?.IataCode === s?.operatingCarrier ||
                                  airline?.IataCode === s?.carrier
                              )?.ImageUrl ? (
                                <img
                                  src={`https://api.nixtour.com/api/Image/GetImage/${
                                    airlines?.find(
                                      (airline: any) =>
                                        airline?.IataCode ===
                                        s?.operatingCarrier
                                    )?.ImageUrl ||
                                    airlines?.find(
                                      (airline: any) =>
                                        airline?.IataCode === s?.carrier
                                    )?.ImageUrl
                                  }`}
                                  alt={
                                    s?.operatingCarrierName ||
                                    airlines?.find(
                                      (airline: any) =>
                                        airline?.IataCode ===
                                          s?.operatingCarrier ||
                                        airline?.IataCode === s?.carrier
                                    )?.AirlineName
                                  }
                                  className="h-20 object-contain object-center p-0 bg-white"
                                />
                              ) : (
                                <Plane className="w-6 h-6 text-violet-700 bg-white border-0" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {/* {
                              airLines.find(
                                (airline) => airline.code === s?.carrier
                              )?.name
                            } */}
                                {s?.operatingCarrierName ||
                                  airlines?.find(
                                    (airline: any) =>
                                      airline?.IataCode ===
                                        s?.operatingCarrier ||
                                      airline?.IataCode === s?.carrier
                                  )?.AirlineName ||
                                  s?.operatingCarrier ||
                                  s?.carrier}{' '}
                                • {s?.operatingCarrier || s?.carrier}-
                                {s?.operatingCarrierNumber || s?.number}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {/* {s?.aircraft ?? 'Aircraft'} */}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-0 justify-between items-start w-full overflow-x-clip">
                            <div className="">
                              <div className="text-xs text-muted-foreground">
                                Departure
                              </div>
                              <div className="text-sm font-semibold">
                                {s?.Departure?.location}
                                {s?.Departure?.terminal &&
                                  ` - Terminal ${s?.Departure?.terminal}`}
                              </div>
                              <div className="text-xs">
                                {formatDate(s?.Departure?.date)} •{' '}
                                {formatTime(s?.Departure?.time)}
                              </div>
                            </div>
                            <div className="">
                              <div className="text-xs text-muted-foreground">
                                Arrival
                              </div>
                              <div className="text-sm font-semibold">
                                {s?.Arrival?.location}{' '}
                                {s?.Arrival?.terminal &&
                                  ` - Terminal ${s?.Arrival?.terminal}`}
                              </div>
                              <div className="text-xs">
                                {formatDate(s?.Arrival?.date)} •{' '}
                                {formatTime(s?.Arrival?.time)}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  Duration
                                </div>
                                <div className="text-sm font-medium">
                                  {s?.duration?.slice(2)}
                                </div>
                              </div>
                            </div>
                            {/* <div className="text-left">
                          <div className="text-xs text-muted-foreground">
                            Flexibility
                          </div>
                          <div className="text-sm flex flex-wrap gap-1 break-words mt-1">
                            {data?.[0]?.brandDetails?.[0]?.BrandAttribute
                              ? data?.[0]?.brandDetails?.[0]?.BrandAttribute?.map(
                                  (included: any, i: number) => {
                                    if (
                                      included?.inclusion === 'Included' &&
                                      included?.classification
                                    ) {
                                      return (
                                        <span
                                          key={i}
                                          className="bg-blue-700 px-2 text-[11px] rounded-full text-white"
                                        >
                                          {included?.classification}
                                        </span>
                                      );
                                    }
                                  }
                                )
                              : '—'}
                          </div>
                        </div> */}
                          </div>
                        </div>

                        {flight?.flightDetails?.length &&
                          i < flight?.flightDetails?.length - 1 && (
                            <div className="mt-3 text-xs text-muted-foreground bg-yellow-50 border border-yellow-100 rounded-md p-2 text-center">
                              <p className="leading-tight">
                                Stop Over at {s?.Arrival?.location} for{' '}
                                {calculateTimeDifference(
                                  {
                                    time: s?.Arrival?.time?.slice(0, 5),
                                    date: s?.Arrival?.date,
                                  },
                                  {
                                    time: flight?.flightDetails?.[
                                      i + 1
                                    ]?.Departure?.time?.slice(0, 5),
                                    date: flight?.flightDetails?.[i + 1]
                                      ?.Departure?.date,
                                  }
                                )}
                              </p>
                            </div>
                          )}
                      </li>
                    ))}
                  </ol>
                ))}

                {/* Important passenger note */}
                <div className="mt-6 p-4 bg-gray-50 rounded-md text-xs text-muted-foreground">
                  Passenger of all nationalities are advised to confirm with
                  respective embassies for all visa requirements. This
                  communication is for informational & general purposes only.
                </div>
              </ScrollArea>
            </div>

            <div className="md:hidden w-full flex">
              <Button
                className="md:hidden bg-[#BC1110] hover:bg-[#BC1110]/90 text-white w-full"
                onClick={() => {
                  setShowFare(!showFare);
                }}
              >
                {showFare ? `Hide Fare Details` : `Show Fare Details`}
              </Button>
              <ShareScreenshot
                id={
                  window.innerWidth < 768
                    ? 'flight-details'
                    : 'flight-details-with-fare'
                }
              />
            </div>

            {showFare && (
              <>
                {/*Right - Fare Summary / Tabs*/}
                <div
                  id="fare-details"
                  className="w-full md:w-[360px] md:max-h-full md:inline-block p-6 bg-blue-700 text-white flex flex-col border-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">Fare Summary</h4>
                      <p className="text-sm opacity-80">Summary & rules</p>
                    </div>
                    {/* <div className="text-sm text-white/80">
                {data?.[0]?.priceDetails?.Base ?? '₹'}
              </div> */}
                  </div>

                  <div className="mt-6 flex-1">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <div>Base Fare</div>
                        <div className="font-medium">
                          {flights?.[0]?.priceDetails?.CurrencyCode?.value
                            ? flights?.[0]?.priceDetails?.CurrencyCode?.value
                            : '₹'}{' '}
                          {flights?.[0]?.priceDetails?.Base
                            ? flights?.[0]?.priceDetails?.Base
                            : null}
                          {/* // Math.round(data?.[0]?.priceDetails?.Base * 0.6) // : '—' */}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <div>Fees & Taxes</div>
                        <div className="font-medium">
                          {(flights?.[0]?.priceDetails?.TotalFees || 0) +
                          (flights?.[0]?.priceDetails?.TotalTaxes || 0)
                            ? `${
                                flights?.[0]?.priceDetails?.CurrencyCode?.value
                                  ? flights?.[0]?.priceDetails?.CurrencyCode
                                      ?.value
                                  : '₹'
                              } ${
                                (flights?.[0]?.priceDetails?.Fees?.TotalFees ||
                                  0) +
                                (flights?.[0]?.priceDetails?.TotalTaxes || 0)
                              }`
                            : '—'}
                        </div>
                      </div>
                      <hr className="my-3 border-white/20" />
                      <div className="flex items-center justify-between text-base font-semibold">
                        <div>Total</div>
                        <div>
                          {flights?.[0]?.priceDetails?.TotalPrice
                            ? `${
                                flights?.[0]?.priceDetails?.CurrencyCode?.value
                                  ? flights?.[0]?.priceDetails?.CurrencyCode
                                      ?.value
                                  : '₹'
                              } ${flights?.[0]?.priceDetails?.TotalPrice}`
                            : `${
                                flights?.[0]?.priceDetails?.CurrencyCode?.value
                                  ? flights?.[0]?.priceDetails?.CurrencyCode
                                      ?.value
                                  : '₹'
                              } ${
                                (flights?.[0]?.priceDetails?.Fees?.TotalFees ||
                                  0) +
                                (flights?.[0]?.priceDetails?.TotalTaxes || 0) +
                                (flights?.[0]?.priceDetails?.Base || 0)
                              }`}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 w-40 rounded-2xl hidden md:inline-block">
                      <ShareScreenshot
                        id={
                          window.innerWidth < 768
                            ? 'flight-details'
                            : 'flight-details-with-fare'
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-xs opacity-90">
                    <div className="mb-2">
                      * Total fare displayed above has been rounded off and may
                      thus show a slight difference.
                    </div>
                    <div className="bg-white/5 p-2 rounded-md text-[12px]">
                      Deal — Get up to 19,000 off. Valid on all payment modes.
                      Use code: INSTALE. TnC apply
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
