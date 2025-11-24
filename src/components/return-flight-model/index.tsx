'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';
import { brandColorMap } from '../flight-model/colorMap';
import {
  ArrowRight,
  CheckCircle,
  IndianRupee,
  MinusCircle,
  XCircle,
} from 'lucide-react';
import { OTALoginPopup } from '../auth-popup/ota-login-popup';
import { useAuthStore } from '../../../stores/authStore';

interface FlightFareModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  flight?: any; // You can define a more specific type based on your flight data structure
  setSequence?: Dispatch<SetStateAction<number>>;
  onwardIndex?: number;
  returnIndex?: number;
}

export default function ReturnFlightFareModal({
  open,
  onOpenChange,
  flight,
  returnIndex,
  onwardIndex,
}: FlightFareModalProps) {
  const [selectedOnwards, setSelectedOnwards] = useState<number>(0);
  const [selectedReturn, setSelectedReturn] = useState<number>(0);
  const [uniqueFlights, setUniqueFlights] = useState<any[]>([]);

  const [selected, setSelected] = useState<number>(0);

  const [redirect, setRedirect] = useState<boolean>(false);
  const [redirectURL, setRedirectURL] = useState<string>('');

  const user = useAuthStore((state) => state.user);

  console.log('Flights', flight);

  let flights = () => {
    const forceResults = true; // Set to true to always include all return flights
    const temp: any[] = [];
    flight?.[1]?.[returnIndex || 0]?.map((f: any) => {
      if (
        f?.combineCode?.[0] ===
          flight?.[0]?.[onwardIndex || 0]?.[selectedOnwards || 0]
            ?.combineCode?.[0] ||
        forceResults
      )
        temp.push(f);
      console.log(f);
    });
    return [flight?.[0]?.[onwardIndex || 0], temp];
  };

  useEffect(() => {
    setUniqueFlights(flights());
  }, [selectedOnwards, setSelectedOnwards, onOpenChange, open, flight]);

  // let uniqueFlights = [
  //   flight?.[0]?.[onwardIndex || 0],
  //   flight?.[1]?.[returnIndex || 0],
  // ];

  //   flight?.map((fl: any) => {
  //     const temp = () => {
  //       const seen = new Set();
  //       return fl?.filter((f: any) => {
  //         const total = f?.priceDetails?.Total;
  //         if (seen.has(total)) return false;
  //         seen.add(total);
  //         return true;
  //       });
  //     };

  //     uniqueFlights.push(...temp());
  //   });

  useEffect(() => {
    setSelected(0);
    setSelectedReturn(0);
    setSelectedOnwards(0);
    setUniqueFlights(flights());
  }, [flight, open, onOpenChange]);

  // // Initialize tripType and journeys from sessionStorage and listen for changes
  // useEffect(() => {
  //   // if (typeof window === 'undefined') return;

  //   // setTripType(sessionStorage.getItem('tripType'));
  //   // const stored = sessionStorage.getItem('journeys');
  //   // setJourneysState(stored ? JSON.parse(stored) : null);

  //   // const handleStorage = (e: StorageEvent) => {
  //   //   if (e.key === 'journeys')
  //   //     setJourneysState(e.newValue ? JSON.parse(e.newValue) : null);
  //   //   if (e.key === 'tripType') setTripType(e.newValue);
  //   // };

  //   // window.addEventListener('storage', handleStorage);
  //   // return () => window.removeEventListener('storage', handleStorage);

  //   setJourneysState({
  //     ...journeysState,
  //     pid1: uniqueFlights?.[0]?.[0]?.productDetails?.[0]?.id,
  //     cid1: uniqueFlights?.[0]?.[0]?.id,
  //     if: uniqueFlights?.[0]?.[0]?.identifier,
  //     cid2: uniqueFlights?.[1]?.[0]?.id,
  //     pid2: uniqueFlights?.[1]?.[0]?.productDetails?.[0]?.id,
  //   });
  // }, [open]);

  //   const returnTrip = sessionStorage.getItem('tripType') === 'round-trip';

  // console.log('flight-model', flight);

  //   const flights = returnTrip ? [flight?.[0], flight?.[1]] : [uniqueFlights];

  //   console.log('Flights', flights);
  console.log('Unique Flights', uniqueFlights);

  const handleBooking = (index: number = 0) => {
    // Read small pieces of info
    const fromCity = sessionStorage.getItem('fromCity') || '';
    const toCity = sessionStorage.getItem('toCity') || '';

    const fromCountry = fromCity.split(' ')?.[1]?.trim() || '';
    const toCountry = toCity.split(' ')?.[1]?.trim() || '';

    const pr =
      fromCountry.toLocaleLowerCase() === 'india' &&
      toCountry.toLocaleLowerCase() === 'india' &&
      fromCity.toLocaleLowerCase().includes('india') &&
      toCity.toLocaleLowerCase().includes('india');

    const pid1 =
      uniqueFlights?.[0]?.[selectedOnwards || index]?.productDetails?.[0]?.id;
    const cid1 = uniqueFlights?.[0]?.[selectedOnwards || index]?.id;
    const identifier =
      uniqueFlights?.[0]?.[selectedOnwards || index]?.identifier;
    const cid2 = uniqueFlights?.[1]?.[selectedReturn || index]?.id;
    const pid2 =
      uniqueFlights?.[1]?.[selectedReturn || index]?.productDetails?.[0]?.id;
    console.log(pr, pid1, cid1, identifier, cid2, pid2);

    const updatedJourneys = {
      pid1,
      cid1,
      if: identifier,
      cid2,
      pid2,
    };

    sessionStorage.setItem('journeys', JSON.stringify(updatedJourneys));

    // // If it's a round-trip and we now have both legs, navigate to the booking page.
    if (
      sessionStorage.getItem('tripType') === 'round-trip' &&
      pid2 &&
      cid2 &&
      pid1 &&
      cid1 &&
      identifier
    ) {
      const url = `/flight-booking?if=${identifier}&pid1=${pid1}&cid1=${cid1}&pr=${!pr}&pid2=${pid2}&cid2=${cid2}`;

      // Navigate. No need to call onOpenChange(false) because navigation unloads the page.
      if (user) {
        window.location.href = url;
        return;
      }

      setRedirectURL(url);
      setRedirect(true);
      return;
    }

    // If we don't have both legs yet, close the modal and wait for the second selection.
    onOpenChange(false);
    return;

    // // Not a round-trip: navigate immediately using the current selection
    // const singleOption = currentOption;
    // const urlSingle = `/flight-booking?if=${singleOption?.identifier || ''}&pid1=${singleOption?.productDetails?.[0]?.id || ''}&cid1=${singleOption?.id || ''}&pr=${!pr}`;
    // window.location.href = urlSingle;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-6xl bg-white sm:rounded-2xl rounded-2xl max-h-[90dvh] p-6 md:max-h-[100dvh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
        <DialogHeader>
          <div className="flex w-fit mb-2 border">
            <Button
              onClick={() => setSelected(0)}
              className={
                selected === 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-md font-bold'
                  : 'bg-white hover:bg-blue-400 text-black hover:text-white px-6 py-2 text-md font-bold'
              }
            >
              Onward Flight
            </Button>

            <Button
              onClick={() => setSelected(1)}
              className={
                selected === 1
                  ? 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-md font-bold'
                  : 'bg-white hover:bg-blue-400 text-black hover:text-white px-6 py-2 text-md font-bold'
              }
            >
              Return Flight
            </Button>
          </div>
          <DialogTitle className="text-xl font-semibold text-start">
            <span className="inline-flex flex-wrap items-center gap-1">
              {uniqueFlights?.[selected]?.[0]?.flightDetails?.map(
                (f: any, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    <span>{f?.Departure?.location}</span>
                    {i !==
                    uniqueFlights?.[selected]?.[0]?.flightDetails?.length -
                      1 ? (
                      <ArrowRight className="w-4 h-4" />
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>{f?.Arrival?.location}</span>
                      </>
                    )}
                  </span>
                )
              )}
            </span>
          </DialogTitle>
          <DialogDescription className="text-start">
            This modal displays detailed information about the selected flight.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Desktop / tablet view — Carousel only if flights > 3 */}
        {uniqueFlights?.length && uniqueFlights?.[selected]?.length && (
          <div className="hidden md:block">
            <Carousel
              opts={{ align: 'start' }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {uniqueFlights?.[selected]?.map(
                  (option: any, index: number) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <Card
                        onClick={() => {
                          if (selected === 0) {
                            setSelectedOnwards(index);
                            // setSelected(1);
                          } else {
                            setSelectedReturn(index);
                            // setSelected(0);
                          }
                        }}
                        className={`cursor-pointer border-2 rounded-xl transition h-full ${
                          (selected === 0 && selectedOnwards === index) ||
                          (selected === 1 && selectedReturn === index)
                            ? 'border-blue-500 shadow-md'
                            : 'border-gray-200'
                        }`}
                      >
                        <CardContent className="p-4 md:h-full relative">
                          {index === 0 && (
                            <span className="absolute -top-3 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                              Recommended
                            </span>
                          )}

                          {/* Brand name */}
                          <div>
                            {option?.brandDetails?.[0]?.name && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  brandColorMap[
                                    option?.brandDetails[0]?.name
                                  ] || 'bg-gray-500 text-white'
                                }`}
                              >
                                {option?.brandDetails?.[0]?.name}
                              </span>
                            )}
                            <h2 className="font-semibold text-lg">
                              {
                                option?.productDetails?.[0]
                                  ?.PassengerFlight?.[0]?.FlightProduct?.[0]
                                  ?.cabin
                              }
                            </h2>
                          </div>

                          {/* Baggage */}
                          <div className="text-sm whitespace-pre-line text-gray-700">
                            {option?.termsAndConditionsDetails?.[0]?.BaggageAllowance?.map(
                              (bag: any, i: number) => (
                                <p
                                  key={i}
                                  title="CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE"
                                >
                                  {bag?.BaggageItem?.[0]
                                    ?.includedInOfferPrice === 'Yes' &&
                                  bag?.BaggageItem?.[0]?.Measurement?.[0]?.value
                                    ? `${bag?.baggageType}: ${bag?.BaggageItem?.[0]?.Measurement?.[0]?.value && bag?.BaggageItem?.[0]?.Measurement?.[0]?.value} Kg`
                                    : /^(?=.*\d).+$/.test(
                                        bag?.BaggageItem?.[0]?.Text
                                      ) &&
                                      `${bag?.baggageType}: ${bag?.BaggageItem?.[0]?.Text && bag?.BaggageItem?.[0]?.Text?.split('AND')?.[0]}`}
                                </p>
                              )
                            )}
                          </div>

                          {/* Flexibility */}
                          <div className="mt-2 mb-12">
                            <h4 className="font-medium mb-1">Flexibility</h4>
                            {option?.brandDetails?.[0]?.BrandAttribute ? (
                              option?.brandDetails?.[0]?.BrandAttribute.map(
                                (f: any, i: number) => (
                                  <p
                                    key={i}
                                    className="flex items-center text-sm text-gray-700"
                                  >
                                    {f?.inclusion === 'Included' ? (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                        {f?.classification}
                                      </>
                                    ) : (
                                      <>
                                        {f?.inclusion === 'Not Offered' ? (
                                          <>
                                            <XCircle className="w-4 h-4 mr-2 text-red-500" />{' '}
                                            {f?.classification}
                                          </>
                                        ) : (
                                          f?.inclusion === 'Chargeable' && (
                                            <>
                                              <MinusCircle className="w-4 h-4 mr-2 text-blue-500" />
                                              {f?.classification ===
                                                'Rebooking' &&
                                              (option
                                                ?.termsAndConditionsDetails?.[0]
                                                ?.Penalties?.[0]?.Change?.[0]
                                                ?.Penalty?.[0]?.Amount?.value ||
                                                option
                                                  ?.termsAndConditionsDetails?.[0]
                                                  ?.Penalties?.[0]?.Change?.[0]
                                                  ?.Penalty?.[0]?.Percent ||
                                                0) > 0 ? (
                                                `${f?.classification}: ${
                                                  option
                                                    ?.termsAndConditionsDetails?.[0]
                                                    ?.Penalties?.[0]
                                                    ?.Change?.[0]?.Penalty?.[0]
                                                    ?.Amount?.value ||
                                                  `${
                                                    option
                                                      ?.termsAndConditionsDetails?.[0]
                                                      ?.Penalties?.[0]
                                                      ?.Change?.[0]
                                                      ?.Penalty?.[0]?.Percent
                                                  }% Penalty`
                                                } ${
                                                  option
                                                    ?.termsAndConditionsDetails?.[0]
                                                    ?.Penalties?.[0]
                                                    ?.Change?.[0]
                                                    ?.PenaltyAppliesTo
                                                    ? option
                                                        ?.termsAndConditionsDetails?.[0]
                                                        ?.Penalties?.[0]
                                                        ?.Change?.[0]
                                                        ?.PenaltyAppliesTo
                                                    : ''
                                                }`
                                              ) : (
                                                <>
                                                  {f?.classification ===
                                                    'Refund' &&
                                                  (option
                                                    ?.termsAndConditionsDetails?.[0]
                                                    ?.Penalties?.[0]
                                                    ?.Cancel?.[0]?.Penalty?.[0]
                                                    ?.Amount?.value ||
                                                    option
                                                      ?.termsAndConditionsDetails?.[0]
                                                      ?.Penalties?.[0]
                                                      ?.Cancel?.[0]
                                                      ?.Penalty?.[0]?.Percent ||
                                                    0) > 0
                                                    ? `${f?.classification}: ${
                                                        option
                                                          ?.termsAndConditionsDetails?.[0]
                                                          ?.Penalties?.[0]
                                                          ?.Cancel?.[0]
                                                          ?.Penalty?.[0]?.Amount
                                                          ?.value ||
                                                        `${
                                                          option
                                                            ?.termsAndConditionsDetails?.[0]
                                                            ?.Penalties?.[0]
                                                            ?.Cancel?.[0]
                                                            ?.Penalty?.[0]
                                                            ?.Percent
                                                        }% Penalty`
                                                      } ${
                                                        option
                                                          ?.termsAndConditionsDetails?.[0]
                                                          ?.Penalties?.[0]
                                                          ?.Cancel?.[0]
                                                          ?.PenaltyAppliesTo
                                                          ? option
                                                              ?.termsAndConditionsDetails?.[0]
                                                              ?.Penalties?.[0]
                                                              ?.Cancel?.[0]
                                                              ?.PenaltyAppliesTo
                                                          : ''
                                                      }`
                                                    : `${f?.classification}`}
                                                </>
                                              )}
                                            </>
                                          )
                                        )}
                                      </>
                                    )}
                                  </p>
                                )
                              )
                            ) : (
                              <>
                                {/* Refund */}
                                <p className="flex items-center text-sm text-gray-700">
                                  {option?.termsAndConditionsDetails?.[0]
                                    ?.Penalties?.[0]?.Cancel?.[0]?.Penalty?.[0]
                                    ?.Amount?.value ? (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  )}
                                  Refund
                                </p>
                                {/* Rebooking */}
                                <p className="flex items-center text-sm text-gray-700">
                                  {option?.termsAndConditionsDetails?.[0]
                                    ?.Penalties?.[0]?.Change?.[0]?.Penalty?.[0]
                                    ?.Amount?.value ? (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  )}
                                  Rebooking
                                </p>
                              </>
                            )}
                          </div>

                          {/* Price */}
                          <div className="absolute bottom-0 right-0 m-4 text-lg font-bold mt-4 bg-blue-500 hover:bg-blue-700 w-fit px-2 py-1 rounded-2xl text-white">
                            <IndianRupee className="w-4 h-4 inline-block -mt-1" />
                            {option?.priceDetails?.TotalPrice}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>

              {/* ✅ Buttons OUTSIDE content */}
              {uniqueFlights?.[selected]?.length > 3 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* 📱 Mobile view — simple stacked list */}
        <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
          {uniqueFlights?.[selected]?.map((option: any, index: number) => (
            <Card
              key={index}
              onClick={() => {
                if (selected === 0) {
                  setSelectedOnwards(index);
                  //   setSelected(1);
                } else {
                  setSelectedReturn(index);
                  //   setSelected(0);
                }
              }}
              className={`cursor-pointer border-2 rounded-xl transition max-w-[93%] ${
                (selected === 0 && selectedOnwards === index) ||
                (selected === 1 && selectedReturn === index)
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200'
              }`}
            >
              <CardContent className="p-4 md:h-full relative">
                {index === 0 && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded absolute -top-3">
                    Recommended
                  </span>
                )}

                {/* Brand name */}
                <div>
                  {option?.brandDetails?.[0]?.name && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        brandColorMap[option?.brandDetails[0]?.name] ||
                        'bg-gray-500 text-white'
                      }`}
                    >
                      {option?.brandDetails?.[0]?.name}
                    </span>
                  )}
                  <h2 className="font-semibold text-lg">
                    {
                      option?.productDetails?.[0]?.PassengerFlight?.[0]
                        ?.FlightProduct?.[0]?.cabin
                    }
                  </h2>
                </div>

                {/* Baggage */}
                <div className="text-sm whitespace-pre-line text-gray-700">
                  {option?.termsAndConditionsDetails?.[0]?.BaggageAllowance?.map(
                    (bag: any, i: number) => (
                      <p
                        key={i}
                        title="CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE"
                      >
                        {bag?.BaggageItem?.[0]?.includedInOfferPrice ===
                          'Yes' &&
                        bag?.BaggageItem?.[0]?.Measurement?.[0]?.value
                          ? `${bag?.baggageType}: ${bag?.BaggageItem?.[0]?.Measurement?.[0]?.value && bag?.BaggageItem?.[0]?.Measurement?.[0]?.value} Kg`
                          : /^(?=.*\d).+$/.test(bag?.BaggageItem?.[0]?.Text) &&
                            `${bag?.baggageType}: ${bag?.BaggageItem?.[0]?.Text && bag?.BaggageItem?.[0]?.Text?.split('AND')?.[0]}`}
                      </p>
                    )
                  )}
                </div>

                {/* Flexibility */}
                <div className="mt-2 mb-12">
                  <h4 className="font-medium mb-1">Flexibility</h4>
                  {option?.brandDetails?.[0]?.BrandAttribute ? (
                    option?.brandDetails?.[0]?.BrandAttribute?.map(
                      (f: any, i: number) => (
                        <p
                          key={i}
                          className="flex items-center text-sm text-gray-700"
                        >
                          {f?.inclusion === 'Included' ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2 text-red-500" />
                          )}
                          {f?.classification}
                        </p>
                      )
                    )
                  ) : (
                    <>
                      {/* Refund */}
                      <p className="flex items-center text-sm text-gray-700">
                        {option?.termsAndConditionsDetails?.[0]?.Penalties?.[0]
                          ?.Cancel?.[0]?.Penalty?.[0]?.Amount?.value ? (
                          <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        )}
                        Refund
                      </p>
                      {/* Rebooking */}
                      <p className="flex items-center text-sm text-gray-700">
                        {option?.termsAndConditionsDetails?.[0]?.Penalties?.[0]
                          ?.Change?.[0]?.Penalty?.[0]?.Amount?.value ? (
                          <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        )}
                        Rebooking
                      </p>
                    </>
                  )}
                </div>

                {/* Price */}
                <div className="absolute bottom-0 right-0 m-4 text-lg font-bold mt-4 bg-blue-500 hover:bg-blue-700 w-fit px-2 py-1 rounded-2xl text-white">
                  {option?.priceDetails?.CurrencyCode?.value ? (
                    `${option?.priceDetails?.CurrencyCode?.value} `
                  ) : (
                    <IndianRupee className="w-4 h-4 inline-block -mt-1" />
                  )}
                  {option?.priceDetails?.TotalPrice}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => handleBooking()}
            className="bg-[#BC1110] hover:bg-[#d60a0a] text-white px-6 py-2 rounded-xl text-md font-bold"
          >
            Book at{' '}
            {selected === 0
              ? `${
                  uniqueFlights?.[selected]?.[selectedOnwards]?.priceDetails
                    ?.CurrencyCode?.value ? (
                    `${uniqueFlights?.[selected]?.[selectedOnwards]?.priceDetails?.CurrencyCode?.value} `
                  ) : (
                    <IndianRupee className="w-7 h-7 inline-block -mx-2" />
                  )
                }
            ${uniqueFlights?.[selected]?.[selectedOnwards]?.priceDetails?.TotalPrice}`
              : `${
                  uniqueFlights?.[selected]?.[selectedReturn]?.priceDetails
                    ?.CurrencyCode?.value ? (
                    `${uniqueFlights?.[selected]?.[selectedReturn]?.priceDetails?.CurrencyCode?.value} `
                  ) : (
                    <IndianRupee className="w-7 h-7 inline-block -mx-2" />
                  )
                }
            ${uniqueFlights?.[selected]?.[selectedReturn]?.priceDetails?.TotalPrice}`}
          </Button>
        </div>
      </DialogContent>
      {redirect && (
        <OTALoginPopup setRedirect={setRedirect} redirectURL={redirectURL} />
      )}
    </Dialog>
  );
}
