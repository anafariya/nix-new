import React, { useEffect, useState } from 'react';
import { FlightDetail } from '../flight/types';
import { IndianRupee, Plane } from 'lucide-react';
import { Button } from '../ui/button';
import dayjs from 'dayjs';
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
} from '../ui/table';
import ReturnFlightFareModal from '../return-flight-model';

export const FlightRoundTripBox: React.FC<FlightDetail> = ({
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

  const [selection, setSelection] = useState<{
    onward: {
      catalogID: string;
      productOptionsIndex: number;
      combinabilityCode?: string;
    };
    return: {
      catalogID: string;
      productOptionsIndex: number;
      combinabilityCode?: string;
    };
  } | null>(null);

  // const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 450);

  const domesticTravel: boolean =
    sessionStorage.getItem('fromCity')?.split(' ')?.[1] ===
    sessionStorage.getItem('toCity')?.split(' ')?.[1];

  const [method, setMethod] = useState<string>('standard');

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 376);
  //   };

  //   // Add event listener
  //   window.addEventListener('resize', handleResize);

  //   // Run once on mount in case screen size changed before component loaded
  //   handleResize();

  //   // Cleanup listener on unmount
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // Filter Flight Data based on sequence
  useEffect(() => {
    setSequencialFlightsData(flightsData);
    setSelection({
      onward: {
        catalogID: '',
        productOptionsIndex: 0,
        combinabilityCode: '',
      },
      return: {
        catalogID: '',
        productOptionsIndex: 0,
        combinabilityCode: '',
      },
    });
    setMethod('standard');
  }, [flightsData]);

  console.log(flightsData);
  const combinabilityCodes: any[] = [];
  const onwardsCatalogs: any[] = [];
  const returnCatalogs: any[] = [];

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
      const dataList: any[] = [];
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
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
              (item: any) => item?.Flight?.length > 0
            )?.Flight?.find((f: any) => f?.id === refId);
          if (flight) flights.push(flight);
        });

        const combineCode = offering?.CombinabilityCode;

        // push the collected details for this offering
        dataList.push({
          id,
          identifier:
            sequencialFlightsData?.CatalogProductOfferingsResponse
              ?.CatalogProductOfferings?.Identifier?.value,
          priceDetails: offering?.BestCombinablePrice,
          brandDetails:
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
              (item: any) => item?.Brand?.length > 0
            )?.Brand?.filter((b: any) => b.id === offering?.Brand?.BrandRef),
          productDetails:
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
              (item: any) => item?.Product?.length > 0
            )?.Product?.filter(
              (p: any) => p.id === offering?.Product?.[0]?.productRef
            ),
          termsAndConditionsDetails:
            sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
              (item: any) => item?.TermsAndConditions?.length > 0
            )?.TermsAndConditions?.filter(
              (t: any) =>
                t.id === offering?.TermsAndConditions?.termsAndConditionsRef
            ),
          flightDetails: flights,
          combineCode,
        });
      });

      flightDetails.push(dataList);
    });

    return flightDetails;
  }

  function dialogData(id: string, index?: number) {
    const flightDetails = getFlightDetails(id);

    console.log('Flight Details for Dialog:', flightDetails);

    return flightDetails?.[index || 0];
    // setSelectedFlight(flightDetails);
  }

  // console.log(sequencialFlightsData);

  // console.log(filters);

  const flightsFilter = (option: any, sequence: number) => {
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

    if (option?.ProductBrandOffering?.[0].ContentSource === 'GDS') {
      flightRefs = option?.flightRefs || [];
      firstFlight =
        sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
          (ref: any) => ref?.Flight?.length > 0
        )?.Flight?.find((f: any) => f.id === flightRefs?.[0]);
      lastFlight =
        sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
          (ref: any) => ref?.Flight?.length > 0
        )?.Flight?.find(
          (f: any) => f.id === flightRefs?.[flightRefs?.length - 1]
        );

      // console.log(firstFlight, lastFlight);
      if (!firstFlight || !lastFlight) {
        return false;
      }

      stops = flightRefs.length - 1;
      price =
        option?.ProductBrandOffering?.[0]?.BestCombinablePrice?.TotalPrice || 0;

      depTime = firstFlight.Departure?.time || '';
      arrTime = lastFlight.Arrival?.time || '';
      depMinutes = formatTimeToMinutes(depTime);
      arrMinutes = formatTimeToMinutes(arrTime);

      if (sequence === 1) {
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

        console.log(filters.priceRange);

        matchesPrice =
          price >= filters.priceRange?.[0] && price <= filters.priceRange?.[1];

        console.log(matchesPrice);

        matchesAirline =
          !filters.airline ||
          filters.airline === 'Any' ||
          firstFlight.carrier === filters.airline ||
          firstFlight.operatingCarrier === filters.airline ||
          firstFlight.operatingCarrierName === filters.airline ||
          firstFlight.carrierCode === filters.airline;

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
        const returnFlightRefs = option?.flightRefs || [];
        const returnFirstFlight =
          sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
            (ref: any) => ref?.Flight?.length > 0
          )?.Flight?.find((f: any) => f?.id === returnFlightRefs?.[0]);
        const returnLastFlight =
          sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.find(
            (ref: any) => ref?.Flight?.length > 0
          )?.Flight?.find(
            (f: any) =>
              f?.id === returnFlightRefs?.[returnFlightRefs?.length - 1]
          );

        // console.log(firstFlight, lastFlight);
        if (!returnFirstFlight || !returnLastFlight) {
          return false;
        }

        stops = returnFlightRefs.length - 1;
        price =
          option?.ProductBrandOffering?.[0]?.BestCombinablePrice?.TotalPrice ||
          0;

        depTime = returnFirstFlight.Departure?.time || '';
        arrTime = returnLastFlight.Arrival?.time || '';
        depMinutes = formatTimeToMinutes(depTime);
        arrMinutes = formatTimeToMinutes(arrTime);

        // filters for return flight
        depStart = formatTimeToMinutes(
          filters.returnDepartureTimeRange.start || '00:00:00'
        );
        depEnd = formatTimeToMinutes(
          filters.returnDepartureTimeRange.end || '23:59:59'
        );
        arrStart = formatTimeToMinutes(
          filters.returnArrivalTimeRange.start || '00:00:00'
        );
        arrEnd = formatTimeToMinutes(
          filters.returnArrivalTimeRange.end || '23:59:59'
        );

        matchesStops =
          (stops === 0 && filters.returnStops.nonStop) ||
          (stops === 1 && filters.returnStops.oneStop) ||
          (stops >= 2 && filters.returnStops.twoPlusStop);

        matchesPrice =
          price >= filters.returnPriceRange?.[0] &&
          price <= filters.returnPriceRange?.[1];

        matchesAirline =
          !filters.returnAirline ||
          filters.returnAirline === 'Any' ||
          returnFirstFlight.operatingCarrier === filters.returnAirline ||
          returnFirstFlight.operatingCarrierName === filters.returnAirline ||
          returnFirstFlight.carrier === filters.returnAirline ||
          returnFirstFlight.carrierCode === filters.returnAirline;

        durationMinutes =
          Number(
            returnFirstFlight?.returnDuration
              ?.slice(2)
              .replace('H', '')
              .replace('M', '')
          ) || 0;
        matchesDuration =
          filters.returnDuration === 'any' ||
          (filters.returnDuration === 'short' && durationMinutes < 180) ||
          (filters.returnDuration === 'medium' &&
            durationMinutes >= 180 &&
            durationMinutes <= 360) ||
          (filters.returnDuration === 'long' && durationMinutes > 360);

        matchesDeparture =
          !filters.returnDepartureTimeRange.start ||
          (depMinutes >= depStart && depMinutes <= depEnd);

        matchesArrival =
          !filters.returnArrivalTimeRange.start ||
          (arrMinutes >= arrStart && arrMinutes <= arrEnd);
      }
    } else {
      flightRefs = option?.flightRefs || [];
      if (flightRefs?.length === 0) {
        sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
          (p: any) => {
            if (
              p?.id ===
              option?.ProductBrandOffering?.[0]?.Product?.[0]?.productRef
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
        option?.ProductBrandOffering?.[0]?.BestCombinablePrice
          ?.PriceBreakdown[0]?.Amount?.Total || 0;

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
      arrEnd = formatTimeToMinutes(filters.arrivalTimeRange.end || '23:59:59');

      matchesStops =
        (stops === 0 && filters.stops.nonStop) ||
        (stops === 1 && filters.stops.oneStop) ||
        (stops >= 2 && filters.stops.twoPlusStop);

      matchesPrice =
        price >= filters.priceRange?.[0] && price <= filters.priceRange?.[1];

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
  };

  sequencialFlightsData?.CatalogProductOfferingsResponse?.CatalogProductOfferings?.CatalogProductOffering?.map(
    (catalog: any) => {
      combinabilityCodes.push({
        cid: catalog?.id,
        sequence: catalog?.sequence,
        ProductBrandOptions: catalog?.ProductBrandOptions,
        firstCombinabilityCode:
          catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
            ?.CombinabilityCode,
      });

      const ProductBrandOptions: any[] = [];

      catalog?.ProductBrandOptions?.forEach((options: any) => {
        if (flightsFilter(options, catalog?.sequence)) {
          ProductBrandOptions.push(options);
        }
      });

      if (catalog?.sequence === 1 && ProductBrandOptions?.length > 0)
        onwardsCatalogs.push({
          cid: catalog?.id,
          sequence: catalog?.sequence,
          ProductBrandOptions: ProductBrandOptions,
          firstCombinabilityCode:
            ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
              ?.CombinabilityCode,
        });
      else if (catalog?.sequence === 2 && ProductBrandOptions?.length > 0)
        returnCatalogs.push({
          cid: catalog?.id,
          sequence: catalog?.sequence,
          ProductBrandOptions: ProductBrandOptions,
          firstCombinabilityCode:
            ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
              ?.CombinabilityCode,
        });
    }
  );

  console.log(combinabilityCodes);
  console.log('Onwards Catalogs:', onwardsCatalogs);
  console.log('Return Catalogs:', returnCatalogs);

  console.log(
    'Total',
    sequencialFlightsData?.CatalogProductOfferingsResponse
      ?.CatalogProductOfferings?.CatalogProductOffering?.length
  );
  // console.log('filteredCatalogs', filteredCatalog?.length);

  // console.log(isMobile);

  // const filteredCatalogs = filteredCatalog;

  return (
    <div className="flex flex-col my-6 md:my-10 items-center gap-4 w-full md:w-[60%]">
      {/* Airline Specific Results */}

      {sequencialFlightsData?.CatalogProductOfferingsResponse
        ?.CatalogProductOfferings?.CatalogProductOffering?.length ? (
        <div className="mb-5 max-w-fit self-center md:self-start md:max-w-full overflow-hidden rounded-2xl sm:rounded-2xl border border-gray-500 border-t-0 border-b-0 z-0 shadow-lg shadow-gray-500 hidden lg:inline-block">
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
                        // onClick={() => {
                        //   dialogData(air?.id);
                        //   setOpen(true);
                        // }}
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

      {/* Button to Switch Methods (Only for domestic flights) */}

      {/* {domesticTravel && (
        <div className="flex flex-row-reverse gap-1 w-full p-1 bg-blue-600 text-white font-semibold">
          <button
            onClick={() => setMethod('standard')}
            className={
              method === 'standard' ? 'flex-1 bg-white text-blue-600' : 'flex-1'
            }
          >
            Standard Method
          </button>
          <button
            onClick={() => setMethod('classic')}
            className={
              method === 'classic' ? 'flex-1 bg-white text-blue-600' : 'flex-1'
            }
          >
            Classic Method
          </button>
        </div>
      )} */}

      {/* All Filtered Flights  */}
      {/* Standard Method */}
      {onwardsCatalogs?.length && method === 'standard' ? (
        onwardsCatalogs.map((catalog: any, index: number) => {
          if (
            returnCatalogs.find(
              (returnCatalog: any) =>
                returnCatalog?.firstCombinabilityCode?.[0] ===
                catalog?.firstCombinabilityCode?.[0]
            ) === undefined
          )
            return null;

          return (
            <div
              key={catalog?.firstCombinabilityCode?.[0]}
              className="flex flex-col border p-4 gap-2 w-[95dvw] mx-auto lg:w-full"
            >
              <div className="flex border p-1 justify-between items-center px-2">
                {/* Price */}
                {/* <div className="text-primary font-bold flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                  {
                    catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
                      ?.BestCombinablePrice?.PriceBreakdown?.[0]?.Amount?.Total
                  }
                </div> */}

                {/* INFO */}
                <span>Option {index + 1}</span>

                {/* CTA */}
                <div
                  // className={
                  //   isMobile ? 'flex flex-row gap-2' : 'flex flex-col gap-2'
                  // }
                  className="flex flex-row gap-2"
                >
                  <Button
                    className="rounded-xl md:px-4 px-2 bg-blue-600 hover:bg-blue-800 text-white inline-block"
                    onClick={() => {
                      const onwardCatalogID = catalog?.cid;
                      const returnCatalogID = returnCatalogs?.find(
                        (rc) =>
                          catalog?.firstCombinabilityCode?.[0] ===
                          rc?.firstCombinabilityCode?.[0]
                      )?.cid;

                      const compatabilityCode =
                        catalog?.firstCombinabilityCode?.[0];

                      const combinabilityCode =
                        catalog?.ProductBrandOptions?.[
                          selection?.onward?.productOptionsIndex || 0
                        ]?.ProductBrandOffering?.[0]?.CombinabilityCode?.[0];

                      // Update selection
                      setSelection({
                        onward: {
                          catalogID: onwardCatalogID || '',
                          productOptionsIndex:
                            selection?.onward?.combinabilityCode ===
                            combinabilityCode
                              ? selection?.onward?.productOptionsIndex || 0
                              : 0,
                          combinabilityCode: compatabilityCode || '',
                        },
                        return: {
                          catalogID: returnCatalogID || '',
                          productOptionsIndex:
                            selection?.return?.combinabilityCode ===
                            combinabilityCode
                              ? selection?.return?.productOptionsIndex || 0
                              : 0,
                          combinabilityCode: compatabilityCode || '',
                        },
                      });

                      // Set dialog data immediately
                      const onwardIndex =
                        selection?.onward?.productOptionsIndex || 0;
                      const returnIndex =
                        selection?.return?.productOptionsIndex || 0;

                      setFlightDialogData([
                        dialogData(onwardCatalogID || '', onwardIndex),
                        dialogData(returnCatalogID || '', returnIndex),
                      ]);

                      setShowFlightDetails(true);
                    }}
                  >
                    Details
                  </Button>
                  <Button
                    className="rounded-xl md:px-4 px-2 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white"
                    onClick={() => {
                      const compatabilityCode =
                        catalog?.firstCombinabilityCode?.[0];

                      const combinabilityCode =
                        catalog?.ProductBrandOptions?.[
                          selection?.onward?.productOptionsIndex || 0
                        ]?.ProductBrandOffering?.[0]?.CombinabilityCode?.[0];

                      const onwardCatalogID = catalog?.cid;
                      const returnCatalogID = returnCatalogs?.find(
                        (rc: any) =>
                          catalog?.firstCombinabilityCode?.[0] ===
                          rc?.firstCombinabilityCode?.[0]
                      )?.cid;

                      // ✅ Update selection state
                      setSelection({
                        onward: {
                          catalogID: onwardCatalogID,
                          productOptionsIndex:
                            selection?.onward?.combinabilityCode ===
                            combinabilityCode
                              ? selection?.onward?.productOptionsIndex || 0
                              : 0,
                          combinabilityCode: compatabilityCode,
                        },
                        return: {
                          catalogID: returnCatalogID,
                          productOptionsIndex:
                            selection?.return?.combinabilityCode ===
                            combinabilityCode
                              ? selection?.return?.productOptionsIndex || 0
                              : 0,
                          combinabilityCode: compatabilityCode,
                        },
                      });

                      // ✅ Use the *new* IDs, not the old state
                      const onwardFlightData = getFlightDetails(
                        onwardCatalogID || ''
                      );
                      const returnFlightData = getFlightDetails(
                        returnCatalogID || ''
                      );
                      setSelectedFlight([onwardFlightData, returnFlightData]);

                      console.log(sequence);
                      setOpen(true);

                      // console.log('Selection:', {
                      //   onwardCatalogID,
                      //   returnCatalogID,
                      //   combinabilityCode,
                      //   onwardIndex:
                      //     selection?.onward?.combinabilityCode ===
                      //     combinabilityCode
                      //       ? selection?.onward?.productOptionsIndex
                      //       : 0,
                      //   returnIndex:
                      //     selection?.return?.combinabilityCode ===
                      //     combinabilityCode
                      //       ? selection?.return?.productOptionsIndex
                      //       : 0,
                      // });
                    }}
                  >
                    Book at
                    <strong>
                      {catalog?.ProductBrandOptions?.[0]
                        ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                        ?.CurrencyCode?.value ? (
                        catalog?.ProductBrandOptions?.[0]
                          ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                          ?.CurrencyCode?.value
                      ) : (
                        <IndianRupee className="w-4 h-4 inline-block" />
                      )}{' '}
                      {
                        catalog?.ProductBrandOptions?.[0]
                          ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                          ?.TotalPrice
                      }
                    </strong>
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <div id="onwards" className="flex-1 flex flex-col gap-2">
                  <div className="bg-gray-200 p-2 px-3">
                    {sessionStorage.getItem('fromCity')?.split(', ')?.[0] || ''}{' '}
                    - {sessionStorage.getItem('toCity')?.split(', ')?.[0] || ''}
                  </div>
                  {catalog?.ProductBrandOptions?.map(
                    (product: any, inx: number) => {
                      const flightRefs: any[] = [];
                      sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
                        (p: any) => {
                          if (
                            p?.id ===
                            product?.ProductBrandOffering?.[0]?.Product?.[0]
                              ?.productRef
                          ) {
                            p?.FlightSegment?.map((f: any) => {
                              flightRefs.push(f?.Flight?.FlightRef);
                            });
                          }
                        }
                      );
                      const direct =
                        product?.flightRefs?.length || flightRefs?.length || 1;

                      const flightDetails: any[] = [];

                      if (product?.flightRefs?.length) {
                        product?.flightRefs?.map((id: string) => {
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
                          time: flightDetails?.[
                            direct - 1
                          ]?.Arrival?.time.slice(0, 5),
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

                      return (
                        <div
                          key={catalog?.cid + inx}
                          className={
                            (inx === 0 &&
                              selection?.onward?.combinabilityCode !=
                                product?.ProductBrandOffering?.[0]
                                  ?.CombinabilityCode?.[0]) ||
                            (selection?.onward?.combinabilityCode ===
                              product?.ProductBrandOffering?.[0]
                                ?.CombinabilityCode?.[0] &&
                              selection?.onward?.productOptionsIndex === inx)
                              ? 'w-full max-w-[90dvw] border shadow-sm transition p-4 flex flex-col gap-4 lg:flex-row lg:items-center border-blue-700 hover:bg-gray-200 relative'
                              : 'w-full max-w-[90dvw] bg-white border shadow-sm transition p-4 flex flex-col gap-4 lg:flex-row lg:items-center hover:bg-gray-200 relative'
                          }
                          onClick={() => {
                            setSelection({
                              onward: {
                                catalogID: selection?.onward?.catalogID || '',
                                productOptionsIndex: inx,
                                combinabilityCode:
                                  product?.ProductBrandOffering?.[0]
                                    ?.CombinabilityCode?.[0],
                              },
                              return: {
                                catalogID: selection?.return?.catalogID || '',
                                productOptionsIndex:
                                  selection?.return?.productOptionsIndex || 0,
                                combinabilityCode:
                                  product?.ProductBrandOffering?.[0]
                                    ?.CombinabilityCode?.[0],
                              },
                            });
                          }}
                        >
                          {/* Airline Info */}
                          <div className="flex flex-row lg:flex-col lg:max-w-24 items-center md:items-start gap-1 text-[12px]">
                            {ImageName ? (
                              <img
                                src={`https://api.nixtour.com/api/Image/GetImage/${ImageName}`}
                                alt={ImageName}
                                className="w-20 object-contain object-center md:object-left p-0 -my-4 bg-white"
                              />
                            ) : (
                              <Plane className="h-7" />
                            )}
                            <span className="font-semibold text-gray-900">
                              {flightDetails?.[0]?.operatingCarrierName ||
                                airLines.find(
                                  (airline) =>
                                    airline.code ===
                                    (flightDetails?.[0]?.operatingCarrier ||
                                      flightDetails?.[0]?.carrier)
                                )?.name ||
                                flightDetails?.[0]?.carrier}
                            </span>
                          </div>

                          {/* Flight Info */}
                          <div className="flex flex-1 justify-between items-center flex-wrap gap-3">
                            {/* Departure */}
                            <div className="flex flex-col items-center text-center">
                              <span className="text-[14px] font-semibold text-gray-900">
                                {flightDetails?.[0]?.Departure?.time.slice(
                                  0,
                                  5
                                )}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {flightDetails?.[0]?.Departure?.location} T
                                {flightDetails?.[0]?.Departure?.terminal || 0}
                              </span>
                            </div>

                            {/* Duration & Stops */}
                            <div className="flex flex-col items-center justify-center text-center gap-1">
                              <span className="text-[11px]  text-gray-500">
                                {duration}
                              </span>
                              <div className="w-15 md:w-20 h-[2px] md:h-[px] bg-gray-500 rounded-full" />
                              <span
                                className="text-[11px] text-gray-600 cursor-pointer"
                                onMouseOver={() =>
                                  setShowStops(catalog?.cid + inx)
                                }
                                onMouseOut={() => setShowStops('')}
                              >
                                {direct === 1 ? 'Direct' : `${direct - 1} Stop`}
                              </span>

                              {showStops === catalog?.cid + inx &&
                                direct > 1 && (
                                  <div
                                    className="absolute bottom-0 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-3 py-2 pb-1 text-gray-800 transition-all duration-300"
                                    onMouseOver={() =>
                                      setShowStops(catalog?.cid + inx)
                                    }
                                    onMouseOut={() => setShowStops('')}
                                  >
                                    <div className="space-y-2 max-h-fit overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                      {flightDetails
                                        ?.slice(0, -1)
                                        ?.map((flight, inx) => (
                                          <div
                                            key={inx}
                                            className="flex flex-col gap-2 pb-3 last:pb-0 border-b last:border-none border-gray-200 w-max"
                                          >
                                            <div className="flex items-start justify-between gap-2 w-full">
                                              {/* Stop Indicator */}
                                              <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded w-fit">
                                                Stop {inx + 1}
                                              </div>

                                              {/* Arrival from previous */}
                                              <div className="w-fit">
                                                <div>
                                                  <p className="font-semibold inline-block text-sm">
                                                    Stop Over at{' '}
                                                    {flight?.Arrival?.location}{' '}
                                                    for{' '}
                                                    {calculateTimeDifference(
                                                      {
                                                        date: flight?.Arrival
                                                          ?.date,
                                                        time: flight.Arrival?.time?.slice(
                                                          0,
                                                          5
                                                        ),
                                                      },
                                                      {
                                                        date: flightDetails?.[
                                                          inx + 1
                                                        ]?.Departure?.date,
                                                        time: flightDetails?.[
                                                          inx + 1
                                                        ]?.Departure?.time?.slice(
                                                          0,
                                                          5
                                                        ),
                                                      }
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                            </div>

                            {/* Arrival */}
                            <div className="flex flex-col items-center text-center">
                              <span className="text-[14px]  font-semibold text-gray-900">
                                {flightDetails?.[
                                  direct - 1
                                ]?.Arrival?.time.slice(0, 5)}
                              </span>
                              <span className="text-[10px]  text-gray-500">
                                {
                                  sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                    (f: any) =>
                                      f.id ===
                                      (catalog?.ProductBrandOptions?.[0]
                                        ?.flightRefs?.[direct - 1] ||
                                        flightRefs[direct - 1])
                                  )?.Arrival?.location
                                }{' '}
                                T
                                {sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                  (f: any) =>
                                    f.id ===
                                    (catalog?.ProductBrandOptions?.[0]
                                      ?.flightRefs?.[direct - 1] ||
                                      flightRefs[direct - 1])
                                )?.Arrival?.terminal || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div id="return" className="flex-1 flex flex-col gap-2">
                  <div className="bg-gray-200 p-2 px-3">
                    {sessionStorage.getItem('toCity')?.split(', ')?.[0] || ''} -{' '}
                    {sessionStorage.getItem('fromCity')?.split(', ')?.[0] || ''}
                  </div>
                  {returnCatalogs
                    .find(
                      (returnCatalog: any) =>
                        returnCatalog?.firstCombinabilityCode?.[0] ===
                        catalog?.firstCombinabilityCode?.[0]
                    )
                    ?.ProductBrandOptions?.map((product: any, inx: number) => {
                      const flightRefs: any[] = [];
                      sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
                        (p: any) => {
                          if (
                            p?.id ===
                            product?.ProductBrandOffering?.[0]?.Product?.[0]
                              ?.productRef
                          ) {
                            p?.FlightSegment?.map((f: any) => {
                              flightRefs.push(f?.Flight?.FlightRef);
                            });
                          }
                        }
                      );
                      const direct =
                        product?.flightRefs?.length || flightRefs?.length || 1;

                      const flightDetails: any[] = [];

                      if (product?.flightRefs?.length) {
                        product?.flightRefs?.map((id: string) => {
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
                          time: flightDetails?.[
                            direct - 1
                          ]?.Arrival?.time.slice(0, 5),
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

                      return (
                        <div
                          key={inx}
                          className={
                            (inx === 0 &&
                              selection?.return?.combinabilityCode !=
                                product?.ProductBrandOffering?.[0]
                                  ?.CombinabilityCode?.[0]) ||
                            (selection?.return?.combinabilityCode ===
                              product?.ProductBrandOffering?.[0]
                                ?.CombinabilityCode?.[0] &&
                              selection?.return?.productOptionsIndex === inx)
                              ? 'w-full max-w-[90dvw] bg-white border shadow-sm hover:bg-gray-200 transition p-4 flex flex-col gap-4 lg:flex-row lg:items-center border-blue-700 relative'
                              : 'w-full max-w-[90dvw] bg-white border shadow-sm hover:bg-gray-200 transition p-4 flex flex-col gap-4 lg:flex-row lg:items-center relative'
                          }
                          onClick={() => {
                            setSelection({
                              onward: selection?.onward ?? {
                                catalogID: '',
                                productOptionsIndex: 0,
                              },
                              return: {
                                catalogID: selection?.return?.catalogID || '',
                                productOptionsIndex: inx,
                                combinabilityCode:
                                  product?.ProductBrandOffering?.[0]
                                    ?.CombinabilityCode?.[0],
                              },
                            });
                          }}
                        >
                          {/* Airline Info */}
                          <div className="flex flex-row lg:flex-col lg:max-w-24 items-center lg:items-start gap-1 text-[12px]">
                            {ImageName ? (
                              <img
                                src={`https://api.nixtour.com/api/Image/GetImage/${ImageName}`}
                                alt={ImageName}
                                className="w-20 object-contain object-center md:object-left p-0 -my-4 bg-white"
                              />
                            ) : (
                              <Plane className="h-7" />
                            )}
                            <span className="break-words font-semibold text-gray-900">
                              {flightDetails?.[0]?.operatingCarrierName ||
                                airLines.find(
                                  (airline) =>
                                    airline.code ===
                                    (flightDetails?.[0]?.operatingCarrier ||
                                      flightDetails?.[0]?.carrier)
                                )?.name ||
                                flightDetails?.[0]?.carrier}
                            </span>
                          </div>

                          {/* Flight Info */}
                          <div className="flex flex-1 justify-between items-center flex-wrap gap-2">
                            {/* Departure */}
                            <div className="flex flex-col items-center text-center">
                              <span className="text-[14px] font-semibold text-gray-900">
                                {flightDetails?.[0]?.Departure?.time.slice(
                                  0,
                                  5
                                )}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {flightDetails?.[0]?.Departure?.location} T
                                {flightDetails?.[0]?.Departure?.terminal || 0}
                              </span>
                            </div>

                            {/* Duration & Stops */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <span className="text-[11px] text-gray-500">
                                {duration}
                              </span>
                              <div className="w-15 md:w-20 h-[2px] md:h-[3px] bg-gray-500 rounded-full" />
                              <span
                                className="text-[11px] text-gray-600 cursor-pointer"
                                onMouseOver={() =>
                                  setShowStops(
                                    catalog?.firstCombinabilityCode?.[0] + inx
                                  )
                                }
                                onMouseOut={() => setShowStops('')}
                              >
                                {direct === 1 ? 'Direct' : `${direct - 1} Stop`}
                              </span>

                              {showStops ===
                                catalog?.firstCombinabilityCode?.[0] + inx &&
                                direct > 1 && (
                                  <div
                                    className="absolute bottom-0 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-3 py-2 pb-1 text-gray-800 transition-all duration-300"
                                    onMouseOver={() =>
                                      setShowStops(
                                        catalog?.firstCombinabilityCode?.[0] +
                                          inx
                                      )
                                    }
                                    onMouseOut={() => setShowStops('')}
                                  >
                                    <div className="space-y-2 max-h-fit overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                      {flightDetails
                                        ?.slice(0, -1)
                                        ?.map((flight, inx) => (
                                          <div
                                            key={inx}
                                            className="flex flex-col gap-2 pb-3 last:pb-0  border-b last:border-none border-gray-200 w-max"
                                          >
                                            <div className="flex items-start justify-between gap-2 w-full">
                                              {/* Stop Indicator */}
                                              <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded w-fit">
                                                Stop {inx + 1}
                                              </div>

                                              {/* Arrival from previous */}
                                              <div className="w-fit">
                                                <div>
                                                  <p className="font-semibold inline-block text-sm">
                                                    Stop Over at{' '}
                                                    {flight?.Arrival?.location}{' '}
                                                    for{' '}
                                                    {calculateTimeDifference(
                                                      {
                                                        date: flight?.Arrival
                                                          ?.date,
                                                        time: flight.Arrival?.time?.slice(
                                                          0,
                                                          5
                                                        ),
                                                      },
                                                      {
                                                        date: flightDetails?.[
                                                          inx + 1
                                                        ]?.Departure?.date,
                                                        time: flightDetails?.[
                                                          inx + 1
                                                        ]?.Departure?.time?.slice(
                                                          0,
                                                          5
                                                        ),
                                                      }
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                            </div>

                            {/* Arrival */}
                            <div className="flex flex-col items-center text-center">
                              <span className="text-[14px]  font-semibold text-gray-900">
                                {flightDetails?.[
                                  direct - 1
                                ]?.Arrival?.time.slice(0, 5)}
                              </span>
                              <span className="text-[10px]  text-gray-500">
                                {
                                  sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                    (f: any) =>
                                      f.id ===
                                      (catalog?.ProductBrandOptions?.[0]
                                        ?.flightRefs?.[direct - 1] ||
                                        flightRefs[direct - 1])
                                  )?.Arrival?.location
                                }{' '}
                                T
                                {sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                  (f: any) =>
                                    f.id ===
                                    (catalog?.ProductBrandOptions?.[0]
                                      ?.flightRefs?.[direct - 1] ||
                                      flightRefs[direct - 1])
                                )?.Arrival?.terminal || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <>
          {onwardsCatalogs?.length && returnCatalogs?.length ? null : (
            <h1 className="text-center text-muted-foreground text-lg mt-10">
              No Flights Found!
            </h1>
          )}
        </>
      )}

      {/* All Filtered Flights */}
      {/* Classic Method */}

      {onwardsCatalogs?.length && domesticTravel && method === 'classic' ? (
        <div
          // key={catalog?.firstCombinabilityCode?.[0]}
          className="flex flex-col border p-4 gap-2 w-[95dvw] mx-auto lg:w-full"
        >
          <div className="flex border p-1 justify-between items-center px-2">
            {/* INFO */}
            <span>Choice {1}</span>

            {/* CTA */}
            <div
              // className={
              //   isMobile ? 'flex flex-row gap-2' : 'flex flex-col gap-2'
              // }
              className="flex flex-row gap-2"
            >
              <Button
                className="rounded-xl md:px-4 px-2 bg-blue-600 hover:bg-blue-800 text-white inline-block"
                onClick={() => {
                  setShowFlightDetails(true);
                }}
              >
                Details
              </Button>
              <Button
                className="rounded-xl md:px-4 px-2 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Book at
                <strong>
                  {/* {catalog?.ProductBrandOptions?.[0]
                        ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                        ?.CurrencyCode?.value ? (
                        catalog?.ProductBrandOptions?.[0]
                          ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                          ?.CurrencyCode?.value
                      ) : (
                        <IndianRupee className="w-4 h-4 inline-block" />
                      )}{' '}
                      {
                        catalog?.ProductBrandOptions?.[0]
                          ?.ProductBrandOffering?.[0]?.BestCombinablePrice
                          ?.TotalPrice
                      } */}
                  100000
                </strong>
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <div id="onwards" className="flex-1 flex flex-col gap-2">
              <div className="bg-gray-200 p-2 px-3">
                {sessionStorage.getItem('fromCity')?.split(', ')?.[0] || ''} -{' '}
                {sessionStorage.getItem('toCity')?.split(', ')?.[0] || ''}
              </div>
              {onwardsCatalogs.map((catalog: any, index: number) =>
                catalog?.ProductBrandOptions?.map(
                  (product: any, inx: number) => {
                    const flightRefs: any[] = [];
                    sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
                      (p: any) => {
                        if (
                          p?.id ===
                          product?.ProductBrandOffering?.[0]?.Product?.[0]
                            ?.productRef
                        ) {
                          p?.FlightSegment?.map((f: any) => {
                            flightRefs.push(f?.Flight?.FlightRef);
                          });
                        }
                      }
                    );
                    const direct =
                      product?.flightRefs?.length || flightRefs?.length || 1;

                    const flightDetails: any[] = [];

                    if (product?.flightRefs?.length) {
                      product?.flightRefs?.map((id: string) => {
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
                        time: flightDetails?.[direct - 1]?.Arrival?.time.slice(
                          0,
                          5
                        ),
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

                    return (
                      <div
                        key={inx}
                        className={
                          inx === 0 && index === 0 && catalog?.sequence === 0
                            ? 'w-full max-w-[90dvw] border shadow-sm transition p-4 flex flex-col gap-4 sm:flex-row sm:items-center border-blue-700 hover:bg-gray-200'
                            : 'w-full max-w-[90dvw] bg-white border shadow-sm transition p-4 flex flex-col gap-4 sm:flex-row sm:items-center hover:bg-gray-200'
                        }
                        onClick={() => {
                          setSelection({
                            onward: {
                              catalogID: selection?.onward?.catalogID || '',
                              productOptionsIndex: inx,
                              combinabilityCode:
                                product?.ProductBrandOffering?.[0]
                                  ?.CombinabilityCode?.[0],
                            },
                            return: {
                              catalogID: selection?.return?.catalogID || '',
                              productOptionsIndex:
                                selection?.return?.productOptionsIndex || 0,
                              combinabilityCode:
                                product?.ProductBrandOffering?.[0]
                                  ?.CombinabilityCode?.[0],
                            },
                          });
                        }}
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
                        </div>

                        {/* Flight Info */}
                        <div className="flex flex-1 justify-between items-center flex-wrap gap-3">
                          {/* Departure */}
                          <div className="flex flex-col items-center text-center">
                            <span className="text-[14px] md:text-base font-semibold text-gray-900">
                              {flightDetails?.[0]?.Departure?.time.slice(0, 5)}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500">
                              {flightDetails?.[0]?.Departure?.location} T
                              {flightDetails?.[0]?.Departure?.terminal || 0}
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
                              onMouseOver={() =>
                                setShowStops(catalog?.cid + inx)
                              }
                              onMouseOut={() => setShowStops('')}
                            >
                              {direct === 1 ? 'Direct' : `${direct - 1} Stop`}
                            </span>

                            {showStops === catalog?.cid + inx && direct > 1 && (
                              <div
                                className="absolute bottom-0 left-0 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-gray-800 transition-all duration-300"
                                onMouseOver={() =>
                                  setShowStops(catalog?.cid + inx)
                                }
                                onMouseOut={() => setShowStops('')}
                              >
                                <div className="space-y-4 max-h-fit overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                  {flightDetails
                                    ?.slice(0, -1)
                                    ?.map((flight, inx) => (
                                      <div
                                        key={inx}
                                        className="flex flex-col gap-3 pb-3 last:pb-0 border-b last:border-none border-gray-200 w-max"
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
                                                Stop Over at{' '}
                                                {flight?.Arrival?.location} for{' '}
                                                {calculateTimeDifference(
                                                  {
                                                    date: flight?.Arrival?.date,
                                                    time: flight.Arrival?.time?.slice(
                                                      0,
                                                      5
                                                    ),
                                                  },
                                                  {
                                                    date: flightDetails?.[
                                                      inx + 1
                                                    ]?.Departure?.date,
                                                    time: flightDetails?.[
                                                      inx + 1
                                                    ]?.Departure?.time?.slice(
                                                      0,
                                                      5
                                                    ),
                                                  }
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Arrival */}
                          <div className="flex flex-col items-center text-center">
                            <span className="text-[14px] md:text-base font-semibold text-gray-900">
                              {flightDetails?.[direct - 1]?.Arrival?.time.slice(
                                0,
                                5
                              )}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500">
                              {
                                sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                  (f: any) =>
                                    f.id ===
                                    (catalog?.ProductBrandOptions?.[0]
                                      ?.flightRefs?.[direct - 1] ||
                                      flightRefs[direct - 1])
                                )?.Arrival?.location
                              }{' '}
                              T
                              {sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                (f: any) =>
                                  f.id ===
                                  (catalog?.ProductBrandOptions?.[0]
                                    ?.flightRefs?.[direct - 1] ||
                                    flightRefs[direct - 1])
                              )?.Arrival?.terminal || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>

            <div id="return" className="flex-1 flex flex-col gap-2">
              <div className="bg-gray-200 p-2 px-3">
                {sessionStorage.getItem('toCity')?.split(', ')?.[0] || ''} -{' '}
                {sessionStorage.getItem('fromCity')?.split(', ')?.[0] || ''}
              </div>
              {returnCatalogs.map((catalog: any, index: number) =>
                catalog?.ProductBrandOptions?.map(
                  (product: any, inx: number) => {
                    const flightRefs: any[] = [];
                    sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
                      (p: any) => {
                        if (
                          p?.id ===
                          product?.ProductBrandOffering?.[0]?.Product?.[0]
                            ?.productRef
                        ) {
                          p?.FlightSegment?.map((f: any) => {
                            flightRefs.push(f?.Flight?.FlightRef);
                          });
                        }
                      }
                    );
                    const direct =
                      product?.flightRefs?.length || flightRefs?.length || 1;

                    const flightDetails: any[] = [];

                    if (product?.flightRefs?.length) {
                      product?.flightRefs?.map((id: string) => {
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
                        time: flightDetails?.[direct - 1]?.Arrival?.time.slice(
                          0,
                          5
                        ),
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

                    return (
                      <div
                        key={inx}
                        className={
                          inx === 0 && index === 0 && catalog?.sequence === 0
                            ? 'w-full max-w-[90dvw] bg-white border shadow-sm hover:bg-gray-200 transition p-4 flex flex-col gap-4 sm:flex-row sm:items-center border-blue-700 relative'
                            : 'w-full max-w-[90dvw] bg-white border shadow-sm hover:bg-gray-200 transition p-4 flex flex-col gap-4 sm:flex-row sm:items-center relative'
                        }
                        onClick={() => {
                          setSelection({
                            onward: selection?.onward ?? {
                              catalogID: '',
                              productOptionsIndex: 0,
                            },
                            return: {
                              catalogID: selection?.return?.catalogID || '',
                              productOptionsIndex: inx,
                              combinabilityCode:
                                product?.ProductBrandOffering?.[0]
                                  ?.CombinabilityCode?.[0],
                            },
                          });
                        }}
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
                          <span className="text-[12px] break-words font-semibold md:text-sm text-gray-900">
                            {flightDetails?.[0]?.operatingCarrierName ||
                              airLines.find(
                                (airline) =>
                                  airline.code ===
                                  (flightDetails?.[0]?.operatingCarrier ||
                                    flightDetails?.[0]?.carrier)
                              )?.name ||
                              flightDetails?.[0]?.carrier}
                          </span>
                        </div>

                        {/* Flight Info */}
                        <div className="flex flex-1 justify-between items-center flex-wrap gap-3">
                          {/* Departure */}
                          <div className="flex flex-col items-center text-center">
                            <span className="text-[14px] md:text-base font-semibold text-gray-900">
                              {flightDetails?.[0]?.Departure?.time.slice(0, 5)}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500">
                              {flightDetails?.[0]?.Departure?.location} T
                              {flightDetails?.[0]?.Departure?.terminal || 0}
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
                              onMouseOver={() =>
                                setShowStops(
                                  catalog?.firstCombinabilityCode?.[0] + inx
                                )
                              }
                              onMouseOut={() => setShowStops('')}
                            >
                              {direct === 1 ? 'Direct' : `${direct - 1} Stop`}
                            </span>

                            {showStops ===
                              catalog?.firstCombinabilityCode?.[0] + inx &&
                              direct > 1 && (
                                <div
                                  className="absolute mt-7 translate-x-24 md:translate-x-0 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-gray-800 transition-all duration-300"
                                  onMouseOver={() =>
                                    setShowStops(
                                      catalog?.firstCombinabilityCode?.[0] + inx
                                    )
                                  }
                                  onMouseOut={() => setShowStops('')}
                                >
                                  <div className="space-y-4 max-h-fit overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                    {flightDetails
                                      ?.slice(0, -1)
                                      ?.map((flight, inx) => (
                                        <div
                                          key={inx}
                                          className="flex flex-col gap-3 pb-3 last:pb-0 border-b last:border-none border-gray-200 w-max"
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
                                                  Stop Over at{' '}
                                                  {flight?.Arrival?.location}{' '}
                                                  for{' '}
                                                  {calculateTimeDifference(
                                                    {
                                                      date: flight?.Arrival
                                                        ?.date,
                                                      time: flight.Arrival?.time?.slice(
                                                        0,
                                                        5
                                                      ),
                                                    },
                                                    {
                                                      date: flightDetails?.[
                                                        inx + 1
                                                      ]?.Departure?.date,
                                                      time: flightDetails?.[
                                                        inx + 1
                                                      ]?.Departure?.time?.slice(
                                                        0,
                                                        5
                                                      ),
                                                    }
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Arrival */}
                          <div className="flex flex-col items-center text-center">
                            <span className="text-[14px] md:text-base font-semibold text-gray-900">
                              {flightDetails?.[direct - 1]?.Arrival?.time.slice(
                                0,
                                5
                              )}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500">
                              {
                                sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                  (f: any) =>
                                    f.id ===
                                    (catalog?.ProductBrandOptions?.[0]
                                      ?.flightRefs?.[direct - 1] ||
                                      flightRefs[direct - 1])
                                )?.Arrival?.location
                              }{' '}
                              T
                              {sequencialFlightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
                                (f: any) =>
                                  f.id ===
                                  (catalog?.ProductBrandOptions?.[0]
                                    ?.flightRefs?.[direct - 1] ||
                                    flightRefs[direct - 1])
                              )?.Arrival?.terminal || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {onwardsCatalogs?.length && returnCatalogs?.length ? null : (
            <h1 className="text-center text-muted-foreground text-lg mt-10">
              No Flights Found!
            </h1>
          )}
        </>
      )}

      <ReturnFlightFareModal
        open={open}
        onOpenChange={setOpen}
        flight={selectedFlight}
        setSequence={setSequence}
        onwardIndex={selection?.onward?.productOptionsIndex || 0}
        returnIndex={selection?.return?.productOptionsIndex || 0}
      />

      {/* Flight details dialog (uses flightDialogData & showFlightDetails) */}
      <FlightDetailsDialog
        open={showFlightDetails}
        onOpenChange={setShowFlightDetails}
        data={flightDialogData}
        airlines={airlines}
      />
    </div>
  );
};
