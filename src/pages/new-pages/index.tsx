import { ModifyFlight } from '../../components/modify-search/flight-search';
import { Navbar } from '../../components/navbar/navbar';
import { FlightBox } from '../../components/flight';
import { useEffect, useState } from 'react';
import { FlightFilters } from '../../components/search-filters';
import Footer from '../../components/footer/footer';
import { useLocation } from 'react-router-dom';
import { useCitiesStore } from '../../../stores/flightStore';
import { Skeleton } from 'antd';
import { FlightRoundTripBox } from '../../components/return-flight';

export default function FlightPage() {
  const { fetchAirlines, airlines, error } = useCitiesStore();
  const fromAirportCode = sessionStorage.getItem('fromAirportCode');
  const toAirportCode = sessionStorage.getItem('toAirportCode');
  const fromCity = sessionStorage.getItem('fromCity');
  const toCity = sessionStorage.getItem('toCity');
  const tripType = sessionStorage.getItem('tripType');
  const onwardDate = sessionStorage.getItem('onwardDate');
  const returnDate = sessionStorage.getItem('returnDate');
  const travelClass = sessionStorage.getItem('travelClass');
  const travelers = JSON.parse(sessionStorage.getItem('travelers') || '');

  const searchParams = {
    fromAirportCode,
    toAirportCode,
    fromCity,
    toCity,
    tripType,
    onwardDate,
    returnDate,
    travelClass,
    travelers,
  };

  useEffect(() => {
    fetchAirlines();
    console.log(error);
  }, [fetchAirlines]);

  type Airline = { code: string; name: string };

  function extractAirlines(data: any): Airline[] {
    // const carriers = new Set<string>();

    // const names = new Set<string>();

    // function walk(obj: any) {

    //   if (Array.isArray(obj)) {
    //     obj.forEach(walk);
    //   } else if (obj && typeof obj === 'object') {
    //     for (const key of Object.keys(obj)) {
    //       const value = obj[key];

    //       if (key === 'carrier' || key === 'operatingCarrier') {
    //         carriers.add(value);
    //       }

    //       if (key === 'operatingCarrierName') {
    //         names.add(value.toUpperCase());
    //       }

    //       walk(value);
    //     }
    //   }
    // }

    // walk(data);

    // console.log(carriers, names);

    // // Convert operating names → IATA codes
    // for (const name of names) {
    //   const code = airlineNameToIATAMap[name];
    //   if (code) carriers.add(code);
    // }

    // // Create final list
    // return [...carriers].map((code) => ({
    //   code,
    //   name:
    //     Object.keys(airlineNameToIATAMap).find(
    //       (n) => airlineNameToIATAMap[n] === code
    //     ) || code, // fallback
    // }));

    const airlineNameToIATAMap: Record<string, string> = {};

    data?.CatalogProductOfferingsResponse?.ReferenceList?.find(
      (ref: any) => ref?.Flight?.length > 0
    )?.Flight?.forEach((flight: any) => {
      const name =
        flight?.operatingCarrierName?.toUpperCase() ||
        flight?.carrierName?.toUpperCase() ||
        flight?.operatingCarrier ||
        flight?.carrier;
      const code = flight?.operatingCarrier || flight?.carrier;
      if (name && code) {
        airlineNameToIATAMap[name] = code;
      }
    });

    // Create final list
    return Object.entries(airlineNameToIATAMap).map(([name, code]) => ({
      code,
      name,
    }));
  }

  // // Suppose current URL is: https://example.com/page?name=John&age=30
  // const url = useMemo(
  //   () => new URL(window.location.href),
  //   [window.location.href]
  // );

  // // Get all search params
  // console.log(url.search); // "?name=John&age=30"

  // // Get specific parameter
  // const name = url.searchParams.get('if');
  // const age = url.searchParams.get('cid');

  // console.log(name); // "John"
  // console.log(age); // "30"

  const [flightsData, setFlightsData] = useState<any>(null);
  // const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  // const [flights, setFlights] = useState<any[]>([]);
  // const [products, setProducts] = useState<any[]>([]);
  // const [termsAndConditions, setTermsAndConditions] = useState<any[]>([]);
  // const [brands, setBrands] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({
    departureTimeRange: { start: '', end: '' },
    arrivalTimeRange: { start: '', end: '' },
    priceRange: [0, 1000000],
    stops: {
      nonStop: true,
      oneStop: true,
      twoPlusStop: true,
    },
    airline: '',
    duration: 'any',
    directFlight: false,
  });

  const [flightFilter, setFlightFilter] = useState<any>({
    departureTimeRange: { start: '', end: '' },
    arrivalTimeRange: { start: '', end: '' },
    priceRange: [0, 1000000],
    stops: {
      nonStop: true,
      oneStop: true,
      twoPlusStop: true,
    },
    airline: '',
    duration: 'any',
    directFlight: false,
    // Returnn Flight Filters
    returnDepartureTimeRange: { start: '', end: '' },
    returnArrivalTimeRange: { start: '', end: '' },
    returnPriceRange: [0, 1000000],
    returnStops: {
      nonStop: true,
      oneStop: true,
      twoPlusStop: true,
    },
    returnAirline: '',
    returnDuration: 'any',
    returnDirectFlight: false,
  });

  const [airLines, setAirLines] = useState<Airline[]>([]);

  const location = useLocation();

  const airlineSpecificData: {
    id: string;
    direct: number;
    price: [number, number, number];
    currencyCode: string;
    airline: string;
    airlineCode: string;
  }[] = [];

  // extracting airlines from flight data
  useEffect(() => {
    setAirLines(extractAirlines(flightsData || {}));
    setFilters({
      departureTimeRange: { start: '', end: '' },
      arrivalTimeRange: { start: '', end: '' },
      priceRange: [0, 1000000],
      stops: {
        nonStop: true,
        oneStop: true,
        twoPlusStop: true,
      },
      airline: '',
      duration: 'any',
      directFlight: false,
    });
    setFlightFilter({
      departureTimeRange: { start: '', end: '' },
      arrivalTimeRange: { start: '', end: '' },
      priceRange: [0, 1000000],
      stops: {
        nonStop: true,
        oneStop: true,
        twoPlusStop: true,
      },
      airline: '',
      duration: 'any',
      directFlight: false,
      // Returnn Flight Filters
      returnDepartureTimeRange: { start: '', end: '' },
      returnArrivalTimeRange: { start: '', end: '' },
      returnPriceRange: [0, 1000000],
      returnStops: {
        nonStop: true,
        oneStop: true,
        twoPlusStop: true,
      },
      returnAirline: '',
      returnDuration: 'any',
      returnDirectFlight: false,
    });
  }, [flightsData]);

  console.log('Extracted Airlines:', airLines);

  // finding cheap flights from each airline for every stops
  flightsData?.CatalogProductOfferingsResponse?.CatalogProductOfferings?.CatalogProductOffering?.forEach(
    (catalog: any) => {
      const flightRefs: any[] = [];
      flightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[1]?.Product?.map(
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

      const airline =
        flightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
          (fl: any) => flightRefs?.[0] === fl?.id
        )?.operatingCarrierName;

      const airlineCode =
        flightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
          (fl: any) => flightRefs?.[0] === fl?.id
        )?.operatingCarrier ||
        flightsData?.CatalogProductOfferingsResponse?.ReferenceList?.[0]?.Flight?.find(
          (fl: any) => flightRefs?.[0] === fl?.id
        )?.carrier;

      const newPrice =
        catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
          ?.BestCombinablePrice?.TotalPrice;

      const currencyCode =
        catalog?.ProductBrandOptions?.[0]?.ProductBrandOffering?.[0]
          ?.BestCombinablePrice?.CurrencyCode?.value || '₹';

      const id = catalog?.id;

      const exists = airlineSpecificData?.find(
        (air: any) => air?.airlineCode === airlineCode
      );

      if (!exists) {
        if (direct === 1)
          airlineSpecificData.push({
            id,
            direct,
            price: [newPrice, 0, 0],
            airline,
            airlineCode,
            currencyCode,
          });
        else if (direct === 2)
          airlineSpecificData.push({
            id,
            direct,
            price: [0, newPrice, 0],
            airline,
            airlineCode,
            currencyCode,
          });
        else
          airlineSpecificData.push({
            id,
            direct,
            price: [0, 0, newPrice],
            airline,
            airlineCode,
            currencyCode,
          });
      } else {
        if (direct <= 3) {
          if (!exists.price[direct - 1]) exists.price[direct - 1] = newPrice;
        } else if (!exists.price[2]) exists.price[2] = newPrice;
      }
    }
  );

  sessionStorage.removeItem('journeys');

  return (
    <div className="min-h-[60dvw] overflow-x-hidden">
      <Navbar />

      <div className="bg-blue-600 h-fit w-full relative flex justify-center">
        <ModifyFlight
          searchParams={searchParams || location.state || {}}
          setFlightsData={setFlightsData}
          // setBrands={setBrands}
          // setCatalogProducts={setCatalogProducts}
          // setTermsAndConditions={setTermsAndConditions}
          // setFlights={setFlights}
          // setProducts={setProducts}
        />
      </div>

      {/* The filters object can now be used here */}
      {flightsData ? (
        <div className="flex flex-col md:flex-row justify-evenly items-center md:items-start w-full">
          {sessionStorage.getItem('tripType') === 'round-trip' ? (
            <>
              <FlightFilters setFilters={setFlightFilter} airLines={airLines} />

              <FlightRoundTripBox
                filters={flightFilter}
                airlines={airlines}
                airlineSpecificData={airlineSpecificData}
                flightsData={flightsData}
              />
            </>
          ) : (
            <>
              <FlightFilters setFilters={setFilters} airLines={airLines} />

              <FlightBox
                filters={filters}
                airlines={airlines}
                airlineSpecificData={airlineSpecificData}
                flightsData={flightsData}
                // catalogProducts={catalogProducts}
                // products={products}
                // termsAndConditions={termsAndConditions}
                // brands={brands}
              />
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-between my-10 mx-auto px-10 overflow-hidden">
          <div className="border rounded-2xl overflow-hidden p-5 w-fit">
            <Skeleton className="w-[97dvw] h-[20dvh] md:w-[25dvw] rounded-full" />
            <Skeleton className="w-[97dvw] h-[20dvh] md:w-[25dvw] rounded-full" />
            <Skeleton className="w-[97dvw] h-[20dvh] md:w-[25dvw] rounded-full" />
          </div>
          <div className="hidden md:inline-block border rounded-2xl overflow-hidden p-5">
            <Skeleton className="h-[20dvh] w-[60dvw] rounded-full" />
            <Skeleton className="h-[20dvh] w-[60dvw] rounded-full" />
            <Skeleton className="h-[20dvh] w-[60dvw] rounded-full" />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
