import { useState, useCallback, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
// import { cn } from '../../../lib/utils';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { DatePicker } from 'antd';
import { Calendar, Plane, ArrowLeftRight } from 'lucide-react';
import type { Travelers, TravelClass } from '../../../types/booking';
// import { useNavigate } from 'react-router-dom';
import { useCitiesStore } from '../../../stores/flightStore';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '../ui/modal';
import axios from 'axios';
import { ModifyFlightInterface } from './types';

import { PopoverContent } from './popover';

export const ModifyFlight: React.FC<ModifyFlightInterface> = ({
  searchParams,
  setFlightsData,
  // setBrands,
  // setCatalogProducts,
  // setFlights,
  // setTermsAndConditions,
  // setProducts,
}) => {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(
    searchParams.tripType || sessionStorage.getItem('tripType') || 'one-way'
  );

  const [fromCity, setFromCity] = useState(searchParams.fromCity || '');
  const [toCity, setToCity] = useState(searchParams.toCity || '');
  const [travelers, setTravelers] = useState<Travelers>(
    searchParams.travelers || {
      adults: 1,
      children: 0,
      infants: 0,
    }
  );
  // const [fromCityCountryCode, setFromCityCountryCode] = useState('');
  // const [toCityCountryCode, setToCityCountryCode] = useState('');
  const [fromAirportCode, setFromAirportCode] = useState(
    searchParams.fromAirportCode || ''
  );
  const [toAirportCode, setToAirportCode] = useState(
    searchParams.toAirportCode || ''
  );
  const [travelClass, setTravelClass] = useState<TravelClass | string>(
    searchParams.travelClass || 'Economy'
  );
  const [onwardDate, setOnwardDate] = useState<dayjs.Dayjs>(
    dayjs(searchParams.onwardDate) || null
  );

  const [returnDate, setReturnDate] = useState<dayjs.Dayjs>(
    dayjs(searchParams.returnDate) || null
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocus, setInputFocus] = useState<'from' | 'to' | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const [ModifyFlight, setModifyFlight] = useState<boolean>(true);

  // const navigate = useNavigate();

  const { cities, fetchCities, isLoading } = useCitiesStore();

  const getTravelersText = () => {
    const total = Object.values(travelers).reduce((a, b) => a + b, 0);
    return `${total} Traveler${total !== 1 ? 's' : ''}`;
  };

  if (fromCity && toCity) {
    document.title = `Book Flight Tickets for ${fromCity.split(',')[0]} to ${toCity.split(',')[0]}`;
  } else {
    document.title = 'Book Flight Tickets Online - Nixtour';
  }

  // // Set default departure date to tomorrow when component mounts
  // useEffect(() => {
  //   const tomorrow = dayjs().add(1, 'day');
  //   setOnwardDate(tomorrow);

  //   // // Validation for blank fields
  //   // if (
  //   //   fromCity.trim() &&
  //   //   toCity.trim() &&
  //   //   onwardDate &&
  //   //   fromAirportCode &&
  //   //   toAirportCode
  //   // ) {
  //   //   if (tripType === 'round-trip' && !returnDate) return;
  //   //   else handleSearchFlights();
  //   // }
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Run once on mount in case screen size changed before component loaded
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to swap airports
  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  // Debouncing function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch cities suggestions based on user input
  const handleCityInput = useCallback(
    debounce((prefix: string) => {
      if (prefix.trim().length > 2) {
        fetchCities(prefix);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  // Function to handle flight search
  const handleSearchFlights = async () => {
    // Validation for blank fields
    if (!fromCity.trim()) {
      setErrorMessage('Please select departure city');
      setIsErrorModalOpen(true);
      return;
    }

    if (!toCity.trim()) {
      setErrorMessage('Please select destination city');
      setIsErrorModalOpen(true);
      return;
    }

    if (!onwardDate) {
      setErrorMessage('Please select departure date');
      setIsErrorModalOpen(true);
      return;
    }

    if (tripType === 'round-trip' && !returnDate) {
      setErrorMessage('Please select return date for round trip');
      setIsErrorModalOpen(true);
      return;
    }

    // const fromAirportCode = fromCity.match(/\(([^)]+)\)/)?.[1] || '';
    // const toAirportCode = toCity.match(/\(([^)]+)\)/)?.[1] || '';

    setFromAirportCode(fromCity.match(/\(([^)]+)\)/)?.[1] || '');
    setToAirportCode(toCity.match(/\(([^)]+)\)/)?.[1] || '');

    if (!fromAirportCode) {
      setErrorMessage(
        'Please select a valid departure city from the suggestions'
      );
      setIsErrorModalOpen(true);
      return;
    }

    if (!toAirportCode) {
      setErrorMessage(
        'Please select a valid destination city from the suggestions'
      );
      setIsErrorModalOpen(true);
      return;
    }

    sessionStorage.setItem('fromAirportCode', fromAirportCode);
    sessionStorage.setItem('toAirportCode', toAirportCode);
    sessionStorage.setItem('fromCity', fromCity);
    sessionStorage.setItem('toCity', toCity);
    sessionStorage.setItem('tripType', tripType);
    sessionStorage.setItem(
      'onwardDate',
      onwardDate ? onwardDate.format('YYYY-MM-DD') : ''
    );
    sessionStorage.setItem(
      'returnDate',
      returnDate ? returnDate.format('YYYY-MM-DD') : ''
    );
    sessionStorage.setItem('travelClass', travelClass);
    sessionStorage.setItem('travelers', JSON.stringify(travelers));

    if (isMobile) setModifyFlight(false);

    // let parameters = {
    //   CatalogProductOfferingsQueryRequest: {
    //     CatalogProductOfferingsRequest: {
    //       '@type': 'CatalogProductOfferingsRequestAir',
    //       maxNumberOfUpsellsToReturn: 4,
    //       offersPerPage,
    //       sortBy: 'Price-LowToHigh',
    //       contentSourceList: ['GDS', 'NDC'],
    //       PassengerCriteria: [
    //         {
    //           '@type': 'PassengerCriteria',
    //           number: travelers.adults,
    //           passengerTypeCode: 'ADT',
    //         },
    //         {
    //           '@type': 'PassengerCriteria',
    //           number: travelers.children,
    //           // passengerTypeCode: 'CNN',
    //           passengerTypeCode: 'CHD',
    //         },
    //         {
    //           '@type': 'PassengerCriteria',
    //           number: travelers.infants,
    //           passengerTypeCode: 'INF',
    //         },
    //       ],
    //       SearchCriteriaFlight: [
    //         {
    //           '@type': 'SearchCriteriaFlight',
    //           departureDate: onwardDate.format('YYYY-MM-DD'),
    //           From: {
    //             value: fromAirportCode,
    //           },
    //           To: {
    //             value: toAirportCode,
    //           },
    //         },
    //       ],
    //       SearchModifiersAir: {
    //         '@type': 'SearchModifiersAir',
    //         // CarrierPreference: [
    //         //   {
    //         //     "@type": "CarrierPreference",
    //         //     preferenceType: "Preferred",
    //         //     carriers: ["UA"],
    //         //   },
    //         // ],
    //         CabinPreference: [
    //           {
    //             '@type': 'CabinPreference',
    //             cabins: [travelClass.replace(' ', '')],
    //             preferenceType: 'Permitted',
    //           },
    //         ],
    //         // ConnectionPreferences: [
    //         //   {
    //         //     "@type": "ConnectionPrefrencesAir",
    //         //     FlightType: {
    //         //       connectionType: "NonStopDirect",
    //         //     },
    //         //   },
    //         // ],
    //       },
    //     },
    //   },
    // };

    let parameters = {
      '@type': 'CatalogProductOfferingsQueryRequest',
      CatalogProductOfferingsRequest: {
        '@type': 'CatalogProductOfferingsRequestAir',
        offersPerPage: 15,
        maxNumberOfUpsellsToReturn: 4,
        contentSourceList: ['GDS'],
        PassengerCriteria: [
          {
            number: travelers.adults || 1,
            passengerTypeCode: 'ADT',
          },
          {
            number: travelers.children,
            passengerTypeCode: 'CHD',
          },
          {
            number: travelers.infants,
            passengerTypeCode: 'INF',
          },
        ],
        SearchCriteriaFlight: [
          {
            '@type': 'SearchCriteriaFlight',
            From: {
              value: fromAirportCode,
            },
            To: {
              value: toAirportCode,
            },
            departureDate: onwardDate.format('YYYY-MM-DD'),
          },
        ],
        SearchModifiersAir: {
          '@type': 'SearchModifiersAir',
          CabinPreference: {
            cabins: travelClass.replace(' ', ''),
            preferenceType: 'Permitted',
          },
        },
        PricingModifiersAir: {
          '@type': 'PricingModifiersAir',
          FareSelection: {
            fareType: 'PublicAndPrivateFares',
            '@type': 'FareSelection',
          },
          CustomResponseModifiersAir: {
            '@type': 'CustomResponseModifiersAir',
            SearchRepresentation: 'Journey',
          },
        },
      },
    };

    if (tripType === 'round-trip') {
      // parameters = {
      //   CatalogProductOfferingsQueryRequest: {
      //     CatalogProductOfferingsRequest: {
      //       '@type': 'CatalogProductOfferingsRequestAir',
      //       maxNumberOfUpsellsToReturn: 4,
      //       offersPerPage,
      //       sortBy: 'Price-LowToHigh',
      //       contentSourceList: ['GDS', 'NDC'],
      //       PassengerCriteria: [
      //         {
      //           '@type': 'PassengerCriteria',
      //           number: travelers.adults,
      //           passengerTypeCode: 'ADT',
      //         },
      //         {
      //           '@type': 'PassengerCriteria',
      //           number: travelers.children,
      //           // passengerTypeCode: 'CNN',
      //           passengerTypeCode: 'CHD',
      //         },
      //         {
      //           '@type': 'PassengerCriteria',
      //           number: travelers.infants,
      //           passengerTypeCode: 'INF',
      //         },
      //       ],
      //       SearchCriteriaFlight: [
      //         {
      //           '@type': 'SearchCriteriaFlight',
      //           departureDate: onwardDate.format('YYYY-MM-DD'),
      //           From: {
      //             value: fromAirportCode,
      //           },
      //           To: {
      //             value: toAirportCode,
      //           },
      //         },
      //         {
      //           '@type': 'SearchCriteriaFlight',
      //           departureDate: returnDate.format('YYYY-MM-DD'),
      //           From: {
      //             value: toAirportCode,
      //           },
      //           To: {
      //             value: fromAirportCode,
      //           },
      //         },
      //       ],
      //       SearchModifiersAir: {
      //         '@type': 'SearchModifiersAir',
      //         // CarrierPreference: [
      //         //   {
      //         //     "@type": "CarrierPreference",
      //         //     preferenceType: "Preferred",
      //         //     carriers: ["UA"],
      //         //   },
      //         // ],
      //         CabinPreference: [
      //           {
      //             '@type': 'CabinPreference',
      //             cabins: [travelClass.replace(' ', '')],
      //             preferenceType: 'Permitted',
      //           },
      //         ],
      //         // ConnectionPreferences: [
      //         //   {
      //         //     "@type": "ConnectionPrefrencesAir",
      //         //     FlightType: {
      //         //       connectionType: "NonStopDirect",
      //         //     },
      //         //   },
      //         // ],
      //       },
      //     },
      //   },
      // };
      parameters = {
        '@type': 'CatalogProductOfferingsQueryRequest',
        CatalogProductOfferingsRequest: {
          '@type': 'CatalogProductOfferingsRequestAir',
          offersPerPage: 15,
          maxNumberOfUpsellsToReturn: 4,
          contentSourceList: ['GDS'],
          PassengerCriteria: [
            {
              number: travelers.adults || 1,
              passengerTypeCode: 'ADT',
            },
            {
              number: travelers.children,
              passengerTypeCode: 'CHD',
            },
            {
              number: travelers.infants,
              passengerTypeCode: 'INF',
            },
          ],
          SearchCriteriaFlight: [
            {
              '@type': 'SearchCriteriaFlight',
              From: {
                value: fromAirportCode,
              },
              To: {
                value: toAirportCode,
              },
              departureDate: onwardDate.format('YYYY-MM-DD'),
            },
            {
              '@type': 'SearchCriteriaFlight',
              From: {
                value: toAirportCode,
              },
              To: {
                value: fromAirportCode,
              },
              departureDate: returnDate.format('YYYY-MM-DD'),
            },
          ],
          SearchModifiersAir: {
            '@type': 'SearchModifiersAir',
            CabinPreference: {
              cabins: travelClass.replace(' ', ''),
              preferenceType: 'Permitted',
            },
          },
          PricingModifiersAir: {
            '@type': 'PricingModifiersAir',
            FareSelection: {
              fareType: 'PublicAndPrivateFares',
              '@type': 'FareSelection',
            },
            CustomResponseModifiersAir: {
              '@type': 'CustomResponseModifiersAir',
              SearchRepresentation: 'Journey',
            },
          },
        },
      };
    }

    console.log('Parameters', parameters);

    // setCatalogProducts([]);
    // setBrands([]);
    // setProducts([]);
    // setFlights([]);
    // setTermsAndConditions([]);
    setFlightsData(null);

    setLoading(true);

    // handleHelmetTitle();

    if (fromCity && toCity) {
      document.title = `Book Flight Tickets for ${fromCity.split(',')[0]} to ${toCity.split(',')[0]}`;
    } else {
      document.title = 'Book Flight Tickets Online - Nixtour';
    }

    await axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/api/travelport/search`,
        parameters,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        // if (response.data?.CatalogProductOfferingsResponse?.Result?.Error) {
        //   // setCatalogProducts([]);
        //   // setBrands([]);
        //   // setProducts([]);
        //   // setFlights([]);
        //   // setTermsAndConditions([]);
        //   setFlightsData(null);

        //   setLoading(false);

        //   return;

        //   // throw Error('No Flights Found!');
        // }
        setFlightsData(response.data);
        // setCatalogProducts(
        //   response.data?.CatalogProductOfferingsResponse
        //     ?.CatalogProductOfferings?.CatalogProductOffering
        // );
        // setFlights(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[0]
        //     ?.Flight
        // );
        // setProducts(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[1]
        //     ?.Product
        // );
        // setTermsAndConditions(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[2]
        //     ?.TermsAndConditions
        // );
        // setBrands(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[3]
        //     ?.Brand
        // );

        fetchAllFlights();
      })
      .catch((error) => {
        console.error(error);
        setModifyFlight(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (fromAirportCode && toAirportCode && onwardDate && travelClass) {
      handleSearchFlights();
    }
  }, []);

  // Temperory function to fetch all flights

  const fetchAllFlights = async () => {
    console.log('Fetching all flights...');
    let parameters = {
      '@type': 'CatalogProductOfferingsQueryRequest',
      CatalogProductOfferingsRequest: {
        '@type': 'CatalogProductOfferingsRequestAir',
        offersPerPage: 1000,
        maxNumberOfUpsellsToReturn: 4,
        contentSourceList: ['GDS'],
        PassengerCriteria: [
          {
            number: travelers.adults || 1,
            passengerTypeCode: 'ADT',
          },
          {
            number: travelers.children,
            passengerTypeCode: 'CHD',
          },
          {
            number: travelers.infants,
            passengerTypeCode: 'INF',
          },
        ],
        SearchCriteriaFlight: [
          {
            '@type': 'SearchCriteriaFlight',
            From: {
              value: fromAirportCode,
            },
            To: {
              value: toAirportCode,
            },
            departureDate: onwardDate.format('YYYY-MM-DD'),
          },
        ],
        SearchModifiersAir: {
          '@type': 'SearchModifiersAir',
          CabinPreference: {
            cabins: travelClass.replace(' ', ''),
            preferenceType: 'Permitted',
          },
        },
        PricingModifiersAir: {
          '@type': 'PricingModifiersAir',
          FareSelection: {
            fareType: 'PublicAndPrivateFares',
            '@type': 'FareSelection',
          },
          CustomResponseModifiersAir: {
            '@type': 'CustomResponseModifiersAir',
            SearchRepresentation: 'Journey',
          },
        },
      },
    };

    if (tripType === 'round-trip') {
      parameters = {
        '@type': 'CatalogProductOfferingsQueryRequest',
        CatalogProductOfferingsRequest: {
          '@type': 'CatalogProductOfferingsRequestAir',
          offersPerPage: 1000,
          maxNumberOfUpsellsToReturn: 4,
          contentSourceList: ['GDS'],
          PassengerCriteria: [
            {
              number: travelers.adults || 1,
              passengerTypeCode: 'ADT',
            },
            {
              number: travelers.children,
              passengerTypeCode: 'CHD',
            },
            {
              number: travelers.infants,
              passengerTypeCode: 'INF',
            },
          ],
          SearchCriteriaFlight: [
            {
              '@type': 'SearchCriteriaFlight',
              From: {
                value: fromAirportCode,
              },
              To: {
                value: toAirportCode,
              },
              departureDate: onwardDate.format('YYYY-MM-DD'),
            },
            {
              '@type': 'SearchCriteriaFlight',
              From: {
                value: toAirportCode,
              },
              To: {
                value: fromAirportCode,
              },
              departureDate: returnDate.format('YYYY-MM-DD'),
            },
          ],
          SearchModifiersAir: {
            '@type': 'SearchModifiersAir',
            CabinPreference: {
              cabins: travelClass.replace(' ', ''),
              preferenceType: 'Permitted',
            },
          },
          PricingModifiersAir: {
            '@type': 'PricingModifiersAir',
            FareSelection: {
              fareType: 'PublicAndPrivateFares',
              '@type': 'FareSelection',
            },
            CustomResponseModifiersAir: {
              '@type': 'CustomResponseModifiersAir',
              SearchRepresentation: 'Journey',
            },
          },
        },
      };
    }

    await axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/api/travelport/search`,
        parameters,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        // if (response.data?.CatalogProductOfferingsResponse?.Result?.Error) {
        //   return;
        //   // throw Error('No Flights Found!');
        // }
        setFlightsData(response.data);
        // setCatalogProducts(
        //   response.data?.CatalogProductOfferingsResponse
        //     ?.CatalogProductOfferings?.CatalogProductOffering
        // );
        // setFlights(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[0]
        //     ?.Flight
        // );
        // setProducts(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[1]
        //     ?.Product
        // );
        // setTermsAndConditions(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[2]
        //     ?.TermsAndConditions
        // );
        // setBrands(
        //   response.data?.CatalogProductOfferingsResponse?.ReferenceList[3]
        //     ?.Brand
        // );
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  if (loading) console.log(loading);

  // handleHelmetTitle

  // function handleHelmetTitle() {
  //   if (fromCity && toCity) {
  //     document.title = `Book Flight Tickets for ${fromCity.split(',')[0]} to ${toCity.split(',')[0]}`;
  //   } else {
  //     document.title = 'Book Flight Tickets Online - Nixtour';
  //   }
  // }

  if (!ModifyFlight && isMobile)
    return (
      <Button
        variant="default"
        className="rounded-full my-4 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white border-0 w-fit"
        onClick={() => setModifyFlight(true)}
      >
        Modify Flight Search
      </Button>
    );

  return (
    <>
      {/* Search Form */}
      <div className="p-3 xs:p-4 flex-1 relative z-2 max-w-[93dvw] md:max-w-7xl mx-auto">
        <div className="mx-auto rounded-2xl bg-white p-4 xs:p-6 shadow-xl border border-white/30">
          <form
            className="space-y-4 xs:space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchFlights();
            }}
          >
            {/* Trip Type Selection */}
            <div className="flex flex-col md:flex-row justify-between gap-4 xs:gap-6">
              <div>
                <RadioGroup
                  defaultValue={tripType}
                  onValueChange={(value) => {
                    setTripType(value as 'one-way' | 'round-trip');
                    if (value !== 'round-trip') {
                      setReturnDate(onwardDate.add(1, 'day'));
                    }
                  }}
                  className="flex gap-4 xs:gap-6"
                >
                  {['one-way', 'round-trip'].map((type) => (
                    <div
                      key={type}
                      className="flex items-center sm:space-x-2 space-x-1"
                    >
                      <RadioGroupItem
                        value={type}
                        id={type}
                        className="border-gray-400 border-[2px] text-[#BC1110] focus:ring-[#BC1110] text-[10px]"
                      />
                      <Label
                        htmlFor={type}
                        className="text-gray-700 font-semibold capitalize sm:text-[12px] text-[10px]"
                      >
                        {type.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {/* <div className="mt-3 xs:mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/group-booking', { replace: true })}
                className="w-full md:w-auto px-6 xs:px-8 py-3 xs:py-4 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-full transition-all font-semibold text-sm xs:text-base"
              >
                Group Booking
              </Button>
            </div> */}
            </div>

            {/* Flight Details - From, Swap, To Layout */}
            <div className="flex flex-col md:flex-row gap-4 xs:gap-6 items-center md:items-start">
              {/* From */}
              <div className="flex-1 w-full border-b-2 md:border-r-2 md:border-b-0">
                <Label
                  htmlFor="from"
                  className="w-full px-3 xs:px-4 text-gray-700 mb-1 block sm:text-[12px] text-[10px]"
                >
                  {/* <PlaneTakeoff className="inline-block mr-2 text-[10px]" /> */}
                  From
                </Label>
                <input
                  type="text"
                  id="from"
                  value={fromCity.split(' -')[0]}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    handleCityInput(e.target.value);
                  }}
                  onFocus={() => setInputFocus('from')}
                  autoComplete="off"
                  placeholder="Enter departure city"
                  className="w-full px-3 xs:py-4 rounded-[12px] border border-gray-300 focus:outline-none text-lg font-bold border-none relative"
                />
                <Label
                  htmlFor="from"
                  className="w-full px-3 xs:px-4 text-gray-700 mb-1 block sm:text-[12px] text-[10px] font-semibold"
                >
                  {/* <PlaneTakeoff className="inline-block mr-2 text-[10px]" /> */}
                  {fromCity.split(' -')[1]}
                </Label>

                {showSuggestions && inputFocus === 'from' && (
                  <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md mt-2 max-h-60 overflow-auto w-auto">
                    {isLoading ? (
                      <li className="p-2 text-center">Loading...</li>
                    ) : cities.length > 0 ? (
                      cities.map((city) => (
                        <li
                          key={uuidv4()}
                          onClick={() => {
                            setFromCity(
                              `${city.CityName}, ${city.CountryName} - ${city.AirportName} (${city.AirportCode})`
                            );
                            setFromAirportCode(city.AirportCode);
                            // setFromCityCountryCode(city.CountryCode);
                            setShowSuggestions(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.CityName}, {city.CountryName} -{' '}
                          {city.AirportName} ({city.AirportCode})
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-center">No results found</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Swap Button - Between From and To */}
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={swapCities}
                  className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors w-10 h-10 z-10"
                  aria-label="Swap cities"
                >
                  <ArrowLeftRight
                    size={14}
                    className="text-gray-700 md:rotate-0 rotate-90"
                  />
                </button>
              </div>

              {/* To */}
              <div className="flex-1 w-full border-b-2 md:border-r-2 md:border-b-0">
                {/* Swap Button - Between From and To */}
                <div className="hidden absolute -ml-9 top-1/2 md:inline-block">
                  <button
                    type="button"
                    onClick={swapCities}
                    className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors w-10 h-10 z-10"
                    aria-label="Swap cities"
                  >
                    <ArrowLeftRight
                      size={14}
                      className="text-gray-700 md:rotate-0 rotate-90"
                    />
                  </button>
                </div>

                <Label
                  htmlFor="to"
                  className="w-full px-3 xs:px-4 text-gray-700 mb-1 block sm:text-[12px] text-[10px]"
                >
                  {/* <PlaneLanding className="inline-block mr-2" /> */}
                  To
                </Label>
                <input
                  type="text"
                  id="to"
                  value={toCity.split(' -')[0]}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    handleCityInput(e.target.value);
                  }}
                  onFocus={() => setInputFocus('to')}
                  autoComplete="off"
                  placeholder="Enter arrival city"
                  className="w-full px-3 xs:py-4 rounded-[12px] border border-gray-300 focus:outline-none text-lg font-bold border-none"
                />
                <Label
                  htmlFor="to"
                  className="w-full px-3 xs:px-4 text-gray-700 mb-1 block sm:text-[12px] text-[10px] font-semibold"
                >
                  {toCity.split(' -')[1]}
                </Label>

                {showSuggestions && inputFocus === 'to' && (
                  <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md mt-2 max-h-60 overflow-auto w-auto">
                    {isLoading ? (
                      <li className="p-2 text-center">Loading...</li>
                    ) : cities.length > 0 ? (
                      cities.map((city) => (
                        <li
                          key={uuidv4()}
                          onClick={() => {
                            setToCity(
                              `${city.CityName}, ${city.CountryName} - ${city.AirportName} (${city.AirportCode})`
                            );
                            // setToCityCountryCode(city.CountryCode);
                            setToAirportCode(city.AirportCode);
                            setShowSuggestions(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.CityName}, {city.CountryName} -{' '}
                          {city.AirportName} ({city.AirportCode})
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-center">No results found</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Date Section */}
              <div className="flex-1 w-full border-b-2 md:border-r-2 md:border-b-0">
                {/* Date Fields - Flex layout for mobile when round-trip */}
                <div
                  className={`${tripType === 'round-trip' ? 'flex gap-3 xs:gap-4' : ''}`}
                >
                  <div
                    className={`${tripType === 'round-trip' ? 'flex-1' : ''}`}
                  >
                    <Label
                      htmlFor="departure-date"
                      className="w-full px-3 text-gray-700 mb-1 block sm:text-[12px] text-[10px]"
                    >
                      Departure
                    </Label>
                    <DatePicker
                      className="w-full focus:outline-none font-bold border-none"
                      id="departure-date"
                      placeholder="Select Departure date"
                      value={onwardDate}
                      format="DD MMM YYYY"
                      disabledDate={(current) => {
                        return (
                          current && current.isBefore(dayjs().startOf('day'))
                        );
                      }}
                      onChange={(date) => setOnwardDate(date)}
                    />
                    <Label
                      htmlFor="departure-date"
                      className="w-full px-3 text-gray-700 mb-1 block sm:text-[12px] text-[10px] font-semibold"
                    >
                      {onwardDate &&
                        new Date(String(onwardDate)).toLocaleDateString(
                          'en-GB',
                          {
                            weekday: 'long',
                          }
                        )}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Return Date - Only show for round-trip */}
              {tripType === 'round-trip' && (
                <div className="flex-1 w-full border-b-2 md:border-r-2 md:border-b-0">
                  <Label
                    htmlFor="return"
                    className="w-full px-3 text-gray-700 mb-1 block sm:text-[12px] text-[10px]"
                  >
                    <Calendar className="inline-block mr-2" />
                    Return
                  </Label>
                  <DatePicker
                    className="w-full px-3 xs:px-4 border-none font-bold border-gray-300 rounded-[12px] focus:outline-none text-sm xs:text-base"
                    placeholder="Select return date"
                    id="return"
                    value={returnDate || null}
                    format="DD MMM YYYY"
                    disabledDate={(current) => {
                      return (
                        current &&
                        current.isBefore(
                          onwardDate?.startOf('day') || dayjs().startOf('day')
                        )
                      );
                    }}
                    onChange={(date) => setReturnDate(date)}
                  />
                  <Label
                    htmlFor="return"
                    className="w-full px-3 text-gray-700 mb-1 block sm:text-[12px] text-[10px] font-semibold"
                  >
                    {returnDate &&
                      new Date(String(returnDate)).toLocaleDateString('en-GB', {
                        // year: 'numeric',
                        // month: 'short',
                        // day: '2-digit',
                        weekday: 'long',
                      })}
                  </Label>
                </div>
              )}

              {/* Travelers & Class */}
              <div
                className="flex-1 w-full border-b-2 md:border-r-2 md:border-b-0 cursor-pointer relative"
                onClick={() => setShow(!show)}
              >
                <Label
                  htmlFor="traveler"
                  className="w-full px-3 xs:px-4 text-gray-700 mb-1 block sm:text-[12px] text-[10px] cursor-pointer"
                >
                  {/* <User className="inline-block mr-2" /> */}
                  Travellers & Class
                </Label>
                <div
                  className="px-3 w-full relative z-10 text-lg font-bold"
                  id="traveler"
                >
                  {getTravelersText()}
                </div>
                <Label
                  htmlFor="traveler"
                  className="w-full px-3 xs:px-4 text-gray-700 mb-1 block sm:text-[12px] text-[10px] font-semibold cursor-pointer"
                >
                  {/* <User className="inline-block mr-2" /> */}
                  {travelClass}
                </Label>{' '}
                {show && (
                  <PopoverContent
                    travelClass={travelClass}
                    travelers={travelers}
                    setTravelClass={setTravelClass}
                    setTravelers={setTravelers}
                    setShow={setShow}
                  />
                )}
              </div>

              {/* Search Button */}
              <div className="flex-1 flex items-center justify-center p-0 mx-auto">
                <Button
                  type="submit"
                  className="w-full md:w-auto px-5 xs:px-8 py-6 xs:py-5 rounded-xl transition-all font-semibold text-sm xs:text-base bg-[#BC1110] hover:bg-[#BC1110]/90 text-white"
                >
                  Modify Search
                  <Plane className="ml-1" />
                </Button>
              </div>
            </div>
          </form>
        </div>
        <Modal
          open={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
        >
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Required Field</h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Button
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-[6px]"
            >
              OK
            </Button>
          </div>
        </Modal>
      </div>
      {/* {loading && (
        <h1 className="text-center mt-10 text-5xl absolute">Loading...</h1>
      )} */}
    </>
  );
};
