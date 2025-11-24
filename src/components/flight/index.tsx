import React, { useEffect, useState } from 'react';
import { FlightDetail } from './types';
import { IndianRupee, Plane } from 'lucide-react';
import { Button } from '../ui/button';
import dayjs from 'dayjs';
import FlightFareModal from '../flight-model';
import { airLines } from '../search-filters/filterOptions';

import { FlightDetailsDialog } from '../flight-details-model';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export const FlightBox: React.FC<FlightDetail> = ({
  filters,
  airlines,
  flightsData,
  airlineSpecificData,
}) => {
  const [showStops, setShowStops] = useState<string>('');
  const [selectedFlight, setSelectedFlight] = useState<any[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [flightDialogData, setFlightDialogData] = useState<any>(null);
  const [showFlightDetails, setShowFlightDetails] = useState<boolean>(false);

  const [sequence, setSequence] = useState<number>(1);
  const [sequencialFlightsData, setSequencialFlightsData] = useState<any>(
    flightsData || null
  );

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 376);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Run once on mount in case screen size changed before component loaded
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter Flight Data based on sequence
  useEffect(() => {
    setSequencialFlightsData(flightsData);
  }, []);

  // console.log(sequencialFlightsData);

  const formatTimeToMinutes = (time: string) => {
    const [hour, min] = time.split(':').map(Number);
    return hour * 60 + min;
  };

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

  function getFlightDetails(id: any) {
    const flightDetails: any[] = [];

    const catalogProduct =
      sequencialFlightsData?.CatalogProductOfferingsResponse?.CatalogProductOfferings?.CatalogProductOffering?.find(
        (catalog: any) => catalog.id === id
      );

    catalogProduct?.ProductBrandOptions?.forEach((options: any) => {
      options?.ProductBrandOffering?.forEach((offering: any) => {
        const flightRefs: string[] = [];
        const flights: any[] = [];

        // collect flightRefs
        sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.forEach(
          (p: any) => {
            if (p?.id === offering?.Product?.[0]?.productRef) {
              p?.FlightSegment?.forEach((f: any) => {
                flightRefs.push(f?.Flight?.FlightRef);
              });
            }
          }
        );

        // match flightRefs with flight details
        flightRefs.forEach((refId: string) => {
          const flight =
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
              (f: any) => f?.id === refId
            );
          if (flight) flights.push(flight);
        });

        // push the collected details for this offering
        flightDetails.push({
          id,
          identifier:
            sequencialFlightsData?.CatalogProductOfferingsResponse
              ?.CatalogProductOfferings?.Identifier?.value,
          priceDetails: offering?.BestCombinablePrice,
          brandDetails:
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[3]?.Brand?.filter(
              (b: any) => b.id === offering?.Brand?.BrandRef
            ),
          productDetails:
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.filter(
              (p: any) => p.id === offering?.Product?.[0]?.productRef
            ),
          termsAndConditionsDetails:
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[2]?.TermsAndConditions?.filter(
              (t: any) =>
                t.id === offering?.TermsAndConditions?.termsAndConditionsRef
            ),
          flightDetails: flights,
        });
      });
    });

    return flightDetails;
  }

  function dialogData(id: string) {
    const flightDetails = getFlightDetails(id);

    setSelectedFlight(flightDetails);
  }

  console.log(sequencialFlightsData);

  // console.log(filters);

  const filteredCatalog =
    sequencialFlightsData?.CatalogProductOfferingsResponse?.CatalogProductOfferings?.CatalogProductOffering?.filter(
      (catalog: any) => {
        let flightRefs: any[] = [];
        let firstFlight: any = null;
        let lastFlight: any = null;
        let stops: number = flightRefs?.length - 1;
        let price: number = 0;

        let depTime: string = '';
        let arrTime: string = '';
        let depMinutes: any = 0;
        let arrMinutes: any = 0;

        let depStart: string | number = '';
        let depEnd: string | number = '';
        let arrStart: string | number = '';
        let arrEnd: string | number = '';

        let matchesStops: any = true;

        let matchesPrice: any = true;

        let matchesAirline: boolean = true;

        let durationMinutes: number | boolean = 0;
        let matchesDuration: boolean = true;

        let matchesDeparture: boolean = true;

        let matchesArrival: boolean = true;

        if (
          catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
            .ContentSource === 'GDS'
        ) {
          flightRefs = catalog?.ProductBrandOptions?.[0]?.flightRefs || [];
          firstFlight =
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
              (f: any) => f.id === flightRefs?.[0]
            );
          lastFlight =
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
              (f: any) => f.id === flightRefs?.[flightRefs?.length - 1]
            );

          // console.log(firstFlight, lastFlight);
          if (!firstFlight || !lastFlight) {
            console.log(flightRefs, catalog);
            return false;
          }

          stops = flightRefs.length - 1;
          price =
            catalog?.ProductBrandOptions[0]?.ProductBrandOffering?.[0]
              ?.BestCombinablePrice?.PriceBreakdown[0]?.Amount?.Total || 0;

          depTime = firstFlight.Departure?.time || '';
          arrTime = lastFlight.Arrival?.time || '';
          depMinutes = formatTimeToMinutes(depTime);
          arrMinutes = formatTimeToMinutes(arrTime);

          depStart = formatTimeToMinutes(
            filters.departureTimeRange.start || '00:00:00'
          );
          depEnd = formatTimeToMinutes(
            filters.departureTimeRange.end || '23:59:59'
          );
          arrStart = formatTimeToMinutes(
            filters.arrivalTimeRange.start || '00:00:00'
          );
          arrEnd = formatTimeToMinutes(
            filters.arrivalTimeRange.end || '23:59:59'
          );

          matchesStops =
            (stops === 0 && filters.stops.nonStop) ||
            (stops === 1 && filters.stops.oneStop) ||
            (stops >= 2 && filters.stops.twoPlusStop);

          matchesPrice =
            price >= filters.priceRange?.[0] &&
            price <= filters.priceRange?.[1];

          matchesAirline =
            !filters.airline ||
            filters.airline === 'Any' ||
            firstFlight.carrier === filters.airline;

          durationMinutes =
            Number(
              firstFlight?.duration?.slice(2).replace('H', '').replace('M', '')
            ) || 0;
          matchesDuration =
            filters.duration === 'any' ||
            (filters.duration === 'short' && durationMinutes < 180) ||
            (filters.duration === 'medium' &&
              durationMinutes >= 180 &&
              durationMinutes <= 360) ||
            (filters.duration === 'long' && durationMinutes > 360);

          matchesDeparture =
            !filters.departureTimeRange.start ||
            (depMinutes >= depStart && depMinutes <= depEnd);

          matchesArrival =
            !filters.arrivalTimeRange.start ||
            (arrMinutes >= arrStart && arrMinutes <= arrEnd);
        } else {
          flightRefs = catalog?.ProductBrandOptions?.[0]?.flightRefs || [];
          if (flightRefs?.length === 0) {
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
              (p: any) => {
                if (
                  p?.id ===
                  catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
                    ?.Product?.[0]?.productRef
                ) {
                  p?.FlightSegment?.map((f: any) => {
                    flightRefs.push(f?.Flight?.FlightRef);
                  });
                }
              }
            );
          }
          firstFlight =
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
              (f: any) => f.id === flightRefs?.[0]
            );
          lastFlight =
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
              (f: any) => f.id === flightRefs?.[flightRefs?.length - 1]
            );

          if (!firstFlight || !lastFlight) {
            return false;
          }

          stops = flightRefs.length - 1;
          price =
            catalog?.ProductBrandOptions[0]?.ProductBrandOffering?.[0]
              ?.BestCombinablePrice?.PriceBreakdown[0]?.Amount?.Total || 0;

          depTime = firstFlight.Departure?.time || '';
          arrTime = lastFlight.Arrival?.time || '';
          depMinutes = formatTimeToMinutes(depTime);
          arrMinutes = formatTimeToMinutes(arrTime);

          depStart = formatTimeToMinutes(
            filters.departureTimeRange.start || '00:00:00'
          );
          depEnd = formatTimeToMinutes(
            filters.departureTimeRange.end || '23:59:59'
          );
          arrStart = formatTimeToMinutes(
            filters.arrivalTimeRange.start || '00:00:00'
          );
          arrEnd = formatTimeToMinutes(
            filters.arrivalTimeRange.end || '23:59:59'
          );

          matchesStops =
            (stops === 0 && filters.stops.nonStop) ||
            (stops === 1 && filters.stops.oneStop) ||
            (stops >= 2 && filters.stops.twoPlusStop);

          matchesPrice =
            price >= filters.priceRange?.[0] &&
            price <= filters.priceRange?.[1];

          matchesAirline =
            !filters.airline ||
            filters.airline === 'Any' ||
            firstFlight.carrier === filters.airline;

          durationMinutes =
            Number(
              firstFlight?.duration?.slice(2).replace('H', '').replace('M', '')
            ) || 0;
          matchesDuration =
            filters.duration === 'any' ||
            (filters.duration === 'short' && durationMinutes < 180) ||
            (filters.duration === 'medium' &&
              durationMinutes >= 180 &&
              durationMinutes <= 360) ||
            (filters.duration === 'long' && durationMinutes > 360);

          matchesDeparture =
            !filters.departureTimeRange.start ||
            (depMinutes >= depStart && depMinutes <= depEnd);

          matchesArrival =
            !filters.arrivalTimeRange.start ||
            (arrMinutes >= arrStart && arrMinutes <= arrEnd);
        }
        return (
          matchesStops &&
          matchesPrice &&
          matchesAirline &&
          matchesDuration &&
          matchesDeparture &&
          matchesArrival
        );
      }
    );

  console.log(
    'Total',
    sequencialFlightsData?.CatalogProductOfferingsResponse
      ?.CatalogProductOfferings?.CatalogProductOffering?.length
  );
  console.log('filteredCatalogs', filteredCatalog?.length);

  const filteredCatalogs = filteredCatalog;
  // sequencialFlightsData?.CatalogProductOfferingsResponse?.CatalogProductOfferings
  //   ?.CatalogProductOffering;

  // console.log('Total', filteredCatalogs?.length);

  // console.log(airlineSpecificData);
  return (
    <div className="flex flex-col my-6 md:my-10 items-center gap-4 w-full md:w-[60%]">
      {/* Airline Specific Results */}

      {sequencialFlightsData?.CatalogProductOfferingsResponse
        ?.CatalogProductOfferings?.CatalogProductOffering?.length ? (
        <div className="mb-5 max-w-fit self-center md:self-start md:max-w-full overflow-hidden rounded-2xl sm:rounded-2xl border border-gray-500 border-t-0 border-b-0 relative z-0 shadow-lg shadow-gray-500 hidden lg:inline-block">
          <div className="max-w-[90dvw] max-h-[33.7dvh] md:max-h-fit">
            {' '}
            {/* max-h-36*/}
            <Table className="max-w-full max-h-fit overflow-y-hidden scrollbar-hide hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] bg-white">
              {/* mb-4  [scrollbar-width:none] [-ms-overflow-style:none] sm:[scrollbar-width:thin] sm:[-ms-overflow-style:thin*/}
              <TableCaption className="m-0">
                {/* A list of airlines with stops and price. */}
              </TableCaption>

              <TableHeader>
                <TableRow className="hover:bg-white">
                  <TableHead className="font-medium text-white bg-blue-700 border-b-slate-200 sticky left-0">
                    Summary
                  </TableHead>
                  {airlineSpecificData?.map((air, i) => (
                    <TableHead
                      key={i}
                      className="text-left whitespace-nowrap border border-r-1 px-8 cursor-pointer"
                    >
                      <span className="">
                        {airlines?.find((a: any) => {
                          return a?.IataCode === air?.airlineCode;
                        })?.ImageUrl ? (
                          <img
                            src={`https://api.nixtour.com/api/Image/GetImage/${
                              airlines?.find((a: any) => {
                                return a?.IataCode === air?.airlineCode;
                              })?.ImageUrl
                            }`}
                            alt={
                              airlines?.find((a: any) => {
                                return a?.IataCode === air?.airlineCode;
                              })?.ImageUrl
                            }
                            className="h-20 object-contain object-center"
                          />
                        ) : (
                          <Plane className="w-6 h-6 text-blue-700 bg-white border-0" />
                        )}
                      </span>
                      <span className="text-[10px] font-medium uppercase text-gray-500 tracking-wide">
                        {air?.airline ||
                          airlines?.find(
                            (airline) => airline?.IataCode === air?.airlineCode
                          )?.AirlineName ||
                          air?.airlineCode}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {['NonStop', '1 Stop', '2+ Stops'].map((stops, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-white bg-blue-700 border-gray-500 border-b-slate-200 sticky left-0">
                      {stops}
                    </TableCell>
                    {airlineSpecificData?.map((air, j) => (
                      <TableCell
                        key={j}
                        className="text-xs border cursor-pointer"
                        onClick={() => {
                          dialogData(air?.id);
                          setOpen(true);
                        }}
                      >
                        {/* {i === air?.direct - 1
                          ? `${air?.currencyCode} ${air?.price?.[i]}`
                          : '-'} */}
                        {air?.price?.[i] != 0
                          ? `${air?.currencyCode} ${air?.price?.[i]}`
                          : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Hide scrollbar cross-browser */}
          <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }

          /* Hide scrollbar but allow scrolling */
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
        </div>
      ) : null}

      {/* {sessionStorage.getItem('tripType') === 'round-trip' && (
        <div>
          <Button onClick={() => setSequence(1)}>Onwards Journey</Button>
          <Button onClick={() => setSequence(2)}>Return Journey</Button>{' '}
        </div>
      )} */}
      {/* 
      {sequence === 1 ? (
        <h1 className="text-left w-full">Select Your Onwards Journey</h1>
      ) : (
        <h1 className="text-left w-full">Select Your Return Journey</h1>
      )} */}

      {/* All Filtered Flights */}

      {filteredCatalogs?.length ? (
        filteredCatalogs.map((catalog: any) => {
          const flightRefs: any[] = [];
          sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
            (p: any) => {
              if (
                p?.id ===
                catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
                  ?.Product?.[0]?.productRef
              ) {
                p?.FlightSegment?.map((f: any) => {
                  flightRefs.push(f?.Flight?.FlightRef);
                });
              }
            }
          );
          const direct =
            catalog?.ProductBrandOptions?.[0]?.flightRefs?.length ||
            flightRefs?.length ||
            1;

          const flightSequence = catalog?.sequence || 1;

          // console.log(direct, flightRefs);
          const flightDetails: any[] = [];

          if (catalog?.ProductBrandOptions?.[0]?.flightRefs?.length) {
            catalog?.ProductBrandOptions?.[0]?.flightRefs?.map((id: string) => {
              sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.map(
                (f: any) => {
                  if (f?.id === id) flightDetails.push(f);
                }
              );
            });
          } else {
            flightRefs?.map((id: string) => {
              sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.map(
                (f: any) => {
                  if (f?.id === id) {
                    flightDetails.push(f);
                  }
                }
              );
            });
          }

          let duration: string = calculateTimeDifference(
            {
              date: flightDetails?.[0]?.Departure?.date,
              time: flightDetails?.[0]?.Departure?.time.slice(0, 5),
            },
            {
              date: flightDetails?.[direct - 1]?.Arrival?.date,
              time: flightDetails?.[direct - 1]?.Arrival?.time.slice(0, 5),
            }
          );

          let ImageName: string =
            airlines?.find((airline: any) => {
              return (
                airline?.IataCode ===
                (flightDetails?.[0]?.operatingCarrier ||
                  flightDetails?.[0]?.carrier)
              );
            })?.ImageUrl || '';

          if (flightSequence === sequence)
            return (
              <div
                key={catalog.id}
                className="w-full max-w-[90dvw] rounded-xl border bg-white shadow-sm hover:shadow-md transition p-4 flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                {/* Airline Info */}
                <div className="flex flex-row sm:flex-col md:max-w-24 items-center md:items-start gap-1 md:min-w-[120px]">
                  {ImageName ? (
                    <img
                      src={`https://api.nixtour.com/api/Image/GetImage/${ImageName}`}
                      alt={ImageName}
                      className="w-20 object-contain object-center md:object-left p-0 -my-4 bg-white"
                    />
                  ) : (
                    <Plane className="h-7" />
                  )}
                  <span className="text-[12px] font-semibold md:text-sm text-gray-900">
                    {flightDetails?.[0]?.operatingCarrierName ||
                      airLines.find(
                        (airline) =>
                          airline.code ===
                          (flightDetails?.[0]?.operatingCarrier ||
                            flightDetails?.[0]?.carrier)
                      )?.name ||
                      flightDetails?.[0]?.carrier}
                  </span>
                  {/* <span className="text-[12px] md:text-xs text-muted-foreground">
                  {flightDetails?.[0]?.carrier}-{flightDetails?.[0]?.number}
                </span> */}
                </div>

                {/* Flight Info */}
                <div className="flex flex-1 justify-between items-center flex-wrap gap-3">
                  {/* Departure */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[14px] md:text-base font-semibold text-gray-900">
                      {flightDetails?.[0]?.Departure?.time?.slice(0, 5)}
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-500">
                      {flightDetails?.[0]?.Departure?.location &&
                        flightDetails?.[0]?.Departure?.location}{' '}
                      T
                      {(flightDetails?.[0]?.Departure?.terminal &&
                        flightDetails?.[0]?.Departure?.terminal) ||
                        0}
                    </span>
                  </div>

                  {/* Duration & Stops */}
                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-[11px] md:text-xs text-gray-500">
                      {duration}
                    </span>
                    <div className="w-16 md:w-20 h-[2px] md:h-[4px] bg-gray-500 rounded-full" />
                    <span
                      className="text-[11px] md:text-xs text-gray-600 cursor-pointer"
                      onMouseOver={() => setShowStops(catalog.id)}
                      onMouseOut={() => setShowStops('')}
                    >
                      {direct === 1 ? 'Direct' : `${direct - 1} Stop`}
                    </span>
                    {/* {showStops === catalog.id && direct > 1 && (
                    <div
                      className="p-4 bg-white rounded-xl shadow-md shadow-black absolute mt-8 z-10 text-md text-left"
                      onMouseOver={() => setShowStops(catalog.id)}
                      onMouseOut={() => setShowStops('')}
                    >
                      {flightDetails.slice(1).map((flight, inx) => {
                        return (
                          <div
                            key={inx}
                            className="text-gray-600 flex flex-col items-start gap-2 w-fit "
                          >
                            <div className="font-bold text-md">
                              Arrival From:{' '}
                              {flightDetails[inx]?.Departure?.location}
                              <br />
                              <p className="flex justify-between font-normal text-sm">
                                <span>
                                  Date:{' '}
                                  {dayjs(
                                    flightDetails?.[inx]?.Arrival?.date
                                  ).format('D MMM, ddd')}
                                </span>
                                <span>
                                  Time:{' '}
                                  {flightDetails?.[inx]?.Arrival?.time.slice(
                                    0,
                                    5
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className="font-bold text-md">
                              Departure From: {flight?.Departure?.location} to{' '}
                              {flight?.Arrival?.location}
                              <br />
                              <p className="flex justify-between font-normal text-sm">
                                <span>
                                  Date:{' '}
                                  {dayjs(flight?.Departure?.date).format(
                                    'D MMM, ddd'
                                  )}
                                </span>
                                <span>
                                  Time: {flight?.Departure?.time.slice(0, 5)}
                                </span>
                              </p>
                            </div>
                            <div className="font-bold text-md">
                              Arrival To: {flight.Arrival?.location}{' '}
                              {flight.Arrival?.terminal &&
                                `at Terminal ${flight.Arrival?.terminal}`}
                              <br />
                              <p className="flex justify-between font-normal text-sm">
                                <span>
                                  Date:{' '}
                                  {dayjs(flight?.Arrival?.date).format(
                                    'D MMM, ddd'
                                  )}
                                </span>
                                <span>
                                  Time: {flight?.Arrival?.time.slice(0, 5)}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )} */}

                    {showStops === catalog.id && direct > 1 && (
                      <div
                        className="absolute mt-7 translate-x-24 md:translate-x-0 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-gray-800 transition-all duration-300"
                        onMouseOver={() => setShowStops(catalog.id)}
                        onMouseOut={() => setShowStops('')}
                      >
                        <div className="space-y-4 max-h-fit overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                          {flightDetails?.slice(0, -1)?.map((flight, inx) => (
                            <div
                              key={inx}
                              className="relative flex flex-col gap-3 pb-3 last:pb-0 border-b last:border-none border-gray-200 w-max"
                            >
                              <div className="flex items-start justify-between gap-4 w-full">
                                {/* Stop Indicator */}
                                <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded w-fit">
                                  Stop {inx + 1}
                                </div>

                                {/* Arrival from previous */}
                                <div className="w-fit">
                                  <div>
                                    <p className="font-semibold inline-block">
                                      {/* Arrival From:{' '}
                                  {flightDetails[inx]?.Departure?.location} */}
                                      Stop Over at {flight?.Arrival?.location}{' '}
                                      for{' '}
                                      {calculateTimeDifference(
                                        {
                                          date: flight?.Arrival?.date,
                                          time: flight.Arrival?.time?.slice(
                                            0,
                                            5
                                          ),
                                        },
                                        {
                                          date: flightDetails?.[inx + 1]
                                            ?.Departure?.date,
                                          time: flightDetails?.[
                                            inx + 1
                                          ]?.Departure?.time?.slice(0, 5),
                                        }
                                      )}
                                    </p>
                                    {/* <p className="text-sm text-gray-500 flex justify-between">
                                  <span>
                                    {dayjs(
                                      flightDetails?.[inx]?.Arrival?.date
                                    ).format('D MMM, ddd')}
                                  </span>
                                  <span>
                                    {flightDetails?.[inx]?.Arrival?.time.slice(
                                      0,
                                      5
                                    )}
                                  </span>
                                </p> */}
                                  </div>
                                </div>
                              </div>
                              {/* Departure */}
                              {/* <div className="flex items-start gap-2">
                              <span className="text-green-500">✈️</span>
                              <div>
                                <p className="font-semibold">
                                  Departure From: {flight?.Departure?.location}{' '}
                                  → {flight?.Arrival?.location}
                                </p>
                                <p className="text-sm text-gray-500 flex justify-between">
                                  <span>
                                    {dayjs(flight?.Departure?.date).format(
                                      'D MMM, ddd'
                                    )}
                                  </span>
                                  <span>
                                    {flight?.Departure?.time.slice(0, 5)}
                                  </span>
                                </p>
                              </div>
                            </div> */}

                              {/* Final Arrival */}
                              {/* <div className="flex items-start gap-2">
                              <span className="text-red-500">📍</span>
                              <div>
                                <p className="font-semibold">
                                  Arrival To: {flight.Arrival?.location}{' '}
                                  {flight.Arrival?.terminal && (
                                    <span className="text-sm text-gray-500">
                                      (Terminal {flight.Arrival?.terminal})
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-500 flex justify-between">
                                  <span>
                                    {dayjs(flight?.Arrival?.date).format(
                                      'D MMM, ddd'
                                    )}
                                  </span>
                                  <span>
                                    {flight?.Arrival?.time.slice(0, 5)}
                                  </span>
                                </p>
                              </div>
                            </div> */}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrival */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[14px] md:text-base font-semibold text-gray-900">
                      {flightDetails?.[direct - 1]?.Arrival?.time.slice(0, 5)}
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-500">
                      {
                        sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
                          (ref: any) => ref?.Flight?.length > 0
                        )?.Flight?.find(
                          (f: any) =>
                            f.id ===
                            (catalog?.ProductBrandOptions?.[0]?.flightRefs?.[
                              direct - 1
                            ] || flightRefs[direct - 1])
                        )?.Arrival?.location
                      }{' '}
                      T
                      {sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                        (f: any) =>
                          f.id ===
                          (catalog?.ProductBrandOptions?.[0]?.flightRefs?.[
                            direct - 1
                          ] || flightRefs[direct - 1])
                      )?.Arrival?.terminal || 0}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-primary font-bold flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                    {
                      catalog?.ProductBrandOptions?.[0]
                        ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                        ?.TotalPrice
                    }
                  </div>

                  {/* CTA */}
                  <div
                    className={
                      isMobile ? 'flex flex-row gap-2' : 'flex flex-col gap-2'
                    }
                  >
                    <Button
                      className="rounded-xl md:px-6 px-2 bg-blue-600 hover:bg-blue-800 text-white"
                      onClick={() => {
                        setFlightDialogData(getFlightDetails(catalog.id));
                        setShowFlightDetails(true);
                      }}
                    >
                      Details
                      {/* {isMobile ? <ChevronRight /> : `Details`} */}
                    </Button>
                    <Button
                      className="rounded-xl md:px-6 px-2 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white"
                      onClick={() => {
                        dialogData(catalog.id);
                        setOpen(true);
                      }}
                    >
                      Select
                      {/* {isMobile ? <ChevronRight /> : `Select`} */}
                    </Button>
                  </div>
                </div>
              </div>
            );
        })
      ) : (
        <h1 className="text-center text-muted-foreground text-lg mt-10">
          No Flights Found!
        </h1>
      )}

      {/* Modal for selected flight - To be implemented */}

      <FlightFareModal
        open={open}
        onOpenChange={setOpen}
        flight={selectedFlight}
        setSequence={setSequence}
      />

      <FlightDetailsDialog
        open={showFlightDetails}
        onOpenChange={setShowFlightDetails}
        data={flightDialogData}
        airlines={airlines}
      />
    </div>
  );
};
