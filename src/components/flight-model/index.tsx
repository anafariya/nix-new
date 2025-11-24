'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { brandColorMap } from './colorMap';
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
}

export default function FlightFareModal({
  open,
  onOpenChange,
  flight,
  setSequence,
}: FlightFareModalProps) {
  const [selected, setSelected] = useState<number>(0);
  const [tripType, setTripType] = useState<string | null>(null);
  const [journeysState, setJourneysState] = useState<any | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [redirectURL, setRedirectURL] = useState<string>('');

  const user = useAuthStore((state) => state.user);

  // const alreadyCovered: any[] = [];

  // console.log('Flights', flight);

  const uniqueFlights = useMemo(() => {
    const seen = new Set();
    return flight?.filter((f: any) => {
      const total = f?.priceDetails?.TotalPrice;
      if (seen.has(total)) return false;
      seen.add(total);
      return true;
    });
  }, [flight]);

  useEffect(() => {
    setSelected(0);
  }, [flight]);

  // Initialize tripType and journeys from sessionStorage and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setTripType(sessionStorage.getItem('tripType'));
    const stored = sessionStorage.getItem('journeys');
    setJourneysState(stored ? JSON.parse(stored) : null);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'journeys')
        setJourneysState(e.newValue ? JSON.parse(e.newValue) : null);
      if (e.key === 'tripType') setTripType(e.newValue);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [open]);

  // console.log('flight-model', flight);

  console.log('Unique Flights', uniqueFlights);

  const handleBooking = (index: number = 0) => {
    onOpenChange(false);

    const fromCity = sessionStorage.getItem('fromCity') || '';
    const toCity = sessionStorage.getItem('toCity') || '';

    const fromCountry = fromCity.split(' ')?.[1]?.trim();
    const toCountry = toCity.split(' ')?.[1]?.trim();

    const pr =
      fromCountry.toLocaleLowerCase() === 'india' &&
      toCountry.toLocaleLowerCase() === 'india' &&
      fromCity.toLocaleLowerCase().includes('india') &&
      toCity.toLocaleLowerCase().includes('india');

    if (sessionStorage.getItem('tripType') === 'round-trip') {
      // read journeys safely
      const stored = sessionStorage.getItem('journeys');
      const journeys = stored ? JSON.parse(stored) : null;

      if (journeys && journeys?.pid1 && journeys?.cid1) {
        // we have a first-leg already: complete booking with both legs
        setRedirectURL(
          `/flight-booking?if=${uniqueFlights?.[index]?.identifier}&pid1=${journeys.pid1}&cid1=${journeys.cid1}&pr=${!pr}&pid2=${
            uniqueFlights?.[index]?.productDetails?.[0]?.id
          }&cid2=${uniqueFlights?.[index]?.id}`
        );

        if (user)
          window.location.href = `/flight-booking?if=${uniqueFlights?.[index]?.identifier}&pid1=${journeys.pid1}&cid1=${journeys.cid1}&pr=${!pr}&pid2=${
            uniqueFlights?.[index]?.productDetails?.[0]?.id
          }&cid2=${uniqueFlights?.[index]?.id}`;

        return;
      }

      // store the selected flight as first-leg and update local state so UI updates
      const newJourneys = {
        pid1: uniqueFlights?.[index]?.productDetails?.[0]?.id,
        cid1: uniqueFlights?.[index]?.id,
      };
      sessionStorage.setItem('journeys', JSON.stringify(newJourneys));
      setJourneysState(newJourneys);

      setSequence?.(2);

      return;
    }

    if (user) {
      window.location.href = `/flight-booking?if=${uniqueFlights?.[index]?.identifier}&pid=${
        uniqueFlights?.[index]?.productDetails?.[0]?.id
      }&cid=${uniqueFlights?.[index]?.id}&pr=${!pr}`;

      return;
    }

    setRedirect(true);

    setRedirectURL(
      `/flight-booking?if=${uniqueFlights?.[index]?.identifier}&pid=${
        uniqueFlights?.[index]?.productDetails?.[0]?.id
      }&cid=${uniqueFlights?.[index]?.id}&pr=${!pr}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-6xl bg-white sm:rounded-2xl rounded-2xl max-h-[90dvh] p-6 md:max-h-[100dvh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            <span className="inline-flex flex-wrap items-center gap-1">
              {flight?.[0]?.flightDetails?.map((f: any, i: number) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span>{f?.Departure?.location}</span>
                  {i !== flight?.[0]?.flightDetails?.length - 1 ? (
                    <ArrowRight className="w-4 h-4" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>{f?.Arrival?.location}</span>
                    </>
                  )}
                </span>
              ))}
            </span>
          </DialogTitle>
          <DialogDescription>
            This modal displays detailed information about the selected flight.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Desktop / tablet view — Carousel only if flights > 3 */}
        {uniqueFlights?.length && (
          <div className="hidden md:block">
            <Carousel
              opts={{ align: 'start' }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {uniqueFlights?.map((option: any, index: number) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      onClick={() => setSelected(index)}
                      className={`cursor-pointer border-2 rounded-xl transition h-full ${
                        selected === index
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
                                                  ?.Penalties?.[0]?.Change?.[0]
                                                  ?.Penalty?.[0]?.Amount
                                                  ?.value ||
                                                `${
                                                  option
                                                    ?.termsAndConditionsDetails?.[0]
                                                    ?.Penalties?.[0]
                                                    ?.Change?.[0]?.Penalty?.[0]
                                                    ?.Percent
                                                }% Penalty`
                                              } ${
                                                option
                                                  ?.termsAndConditionsDetails?.[0]
                                                  ?.Penalties?.[0]?.Change?.[0]
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
                                                  ?.Penalties?.[0]?.Cancel?.[0]
                                                  ?.Penalty?.[0]?.Amount
                                                  ?.value ||
                                                  option
                                                    ?.termsAndConditionsDetails?.[0]
                                                    ?.Penalties?.[0]
                                                    ?.Cancel?.[0]?.Penalty?.[0]
                                                    ?.Percent ||
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
                ))}
              </CarouselContent>

              {/* ✅ Buttons OUTSIDE content */}
              {uniqueFlights?.length > 3 && (
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
          {uniqueFlights?.map((option: any, index: number) => (
            <Card
              key={index}
              onClick={() => setSelected(index)}
              className={`cursor-pointer border-2 rounded-xl transition ${
                selected === index
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
                          ? `${bag?.baggageType}: 1 X ${bag?.BaggageItem?.[0]?.Measurement?.[0]?.value} Kg`
                          : `${bag?.baggageType}: 1 X ${bag?.BaggageItem?.[0]?.Text || 0}`}
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
                  <IndianRupee className="w-4 h-4 inline-block -mt-1" />
                  {option?.priceDetails?.TotalPrice}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              handleBooking(selected);
            }}
            className="bg-[#BC1110] hover:bg-[#d60a0a] text-white px-6 py-2 rounded-xl text-md font-bold"
          >
            {tripType === 'round-trip' && journeysState
              ? 'Select Offer'
              : 'Book at'}
            &nbsp;
            {uniqueFlights?.[selected]?.priceDetails?.CurrencyCode?.value ? (
              `${uniqueFlights?.[selected]?.priceDetails?.CurrencyCode?.value} `
            ) : (
              <IndianRupee className="w-7 h-7 inline-block -mx-2" />
            )}
            {uniqueFlights?.[selected]?.priceDetails?.TotalPrice}
          </Button>
        </div>
      </DialogContent>
      {redirect && (
        <OTALoginPopup setRedirect={setRedirect} redirectURL={redirectURL} />
      )}
    </Dialog>
  );
}
