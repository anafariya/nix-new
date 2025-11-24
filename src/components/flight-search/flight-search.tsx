import { useState, useCallback, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { DatePicker } from 'antd';
import { TravelersDropdown } from '../travellers-dropdown/travellers-dropdown';
import {
  Calendar,
  User,
  PlaneTakeoff,
  PlaneLanding,
  Plane,
  ArrowLeftRight,
} from 'lucide-react';
import type { Travelers, TravelClass } from '../../../types/booking';
import { useNavigate } from 'react-router-dom';
import { useCitiesStore } from '../../../stores/flightStore';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '../ui/modal';

export default function FlightBooking() {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [returnDate, setReturnDate] = useState<dayjs.Dayjs | null>(null);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  // const [fromCityCountryCode, setFromCityCountryCode] = useState('');
  // const [toCityCountryCode, setToCityCountryCode] = useState('');
  const [travelClass, setTravelClass] = useState<TravelClass>('Economy');
  const [onwardDate, setOnwardDate] = useState<dayjs.Dayjs | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocus, setInputFocus] = useState<'from' | 'to' | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { cities, fetchCities, isLoading } = useCitiesStore();

  // Set default departure date to tomorrow when component mounts
  useEffect(() => {
    const tomorrow = dayjs().add(1, 'day');
    setOnwardDate(tomorrow);

    sessionStorage.clear();
  }, []);

  const handleTravelersUpdate = (
    newTravelers: Travelers,
    newClass: TravelClass
  ) => {
    setTravelers(newTravelers);
    setTravelClass(newClass);
  };

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

  const handleSearchFlights = () => {
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

    const fromAirportCode = fromCity.match(/\(([^)]+)\)/)?.[1] || '';
    const toAirportCode = toCity.match(/\(([^)]+)\)/)?.[1] || '';

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

    // const url = new URL('https://fares.nixtour.com/Metabook/Home/Landing');
    // const params: { [key: string]: string } = {
    //   CompanyId: 'KN2182',
    //   LanguageCode: 'GB',
    //   FlightMode: 'I',
    //   JourneyType: tripType === 'round-trip' ? 'R' : 'O',
    //   websiteId: '13671',
    //   ClientId: '',
    //   SalesChannel: 'Online-DC',
    //   AgentName: '',
    //   SearchType: 'Flight',
    //   CabinClass:
    //     travelClass === 'Economy'
    //       ? '3'
    //       : travelClass === 'Business'
    //         ? '2'
    //         : travelClass === 'First Class'
    //           ? '1'
    //           : '4',
    //   Dep: fromAirportCode,
    //   Arr: toAirportCode,
    //   DepDt: onwardDate ? onwardDate.format('DD-MMM-YYYY') : '',
    //   RetDt: returnDate ? returnDate.format('DD-MMM-YYYY') : '',
    //   Adt: travelers.adults.toString(),
    //   Chd: travelers.children.toString(),
    //   Inf: travelers.infants.toString(),
    //   cl:
    //     travelClass === 'Economy'
    //       ? '3'
    //       : travelClass === 'Business'
    //         ? '2'
    //         : travelClass === 'First Class'
    //           ? '1'
    //           : '4',
    //   DirectFlight: 'False',
    //   IntAirline: '',
    //   DepCity: fromCity,
    //   ArrCity: toCity,
    //   LCCRTChkBox: '',
    //   DepDate: onwardDate ? onwardDate.format('DD-MMM-YYYY') : '',
    //   RetDate: returnDate ? returnDate.format('DD-MMM-YYYY') : '',
    //   Airline: '',
    //   Flexi: 'False',
    //   comp_currency: 'INR',
    //   uid: uuidv4(),
    //   DepCountryCode: fromCityCountryCode,
    //   ArrCountryCode: toCityCountryCode,
    //   IsLogin: 'false',
    //   BranchId: '2214',
    // };

    // Object.keys(params).forEach((key) =>
    //   url.searchParams.append(key, params[key as keyof typeof params] as string)
    // );

    // console.log('Final URL:', url.toString());
    // window.location.href = url.toString();

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

    navigate('/flight-search');
  };

  return (
    <div className="p-3 xs:p-4">
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-4 xs:p-6 shadow-xl border border-white/30">
        <form
          className="space-y-6 xs:space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchFlights();
          }}
        >
          {/* Trip Type Selection */}
          <div className="flex flex-col md:flex-row justify-between gap-4 xs:gap-6">
            <div>
              <RadioGroup
                defaultValue="one-way"
                onValueChange={(value) => {
                  setTripType(value as 'one-way' | 'round-trip');
                  if (value !== 'round-trip') {
                    setReturnDate(null);
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
                      className="border-gray-400 border-[2px] text-[#BC1110] focus:ring-[#BC1110]"
                    />
                    <Label
                      htmlFor={type}
                      className="text-gray-700 font-semibold capitalize sm:text-base text-sm"
                    >
                      {type.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="mt-3 xs:mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/group-booking', { replace: true })}
                className="w-full md:w-auto px-6 xs:px-8 py-3 xs:py-4 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-full transition-all font-semibold text-sm xs:text-base"
              >
                Group Booking
              </Button>
            </div>
          </div>

          {/* Flight Details - From, Swap, To Layout */}
          <div className="flex flex-col md:flex-row gap-4 xs:gap-6 items-center">
            {/* From */}
            <div className="flex-1 w-full">
              <Label
                htmlFor="from"
                className="text-gray-700 mb-1 block sm:text-base text-sm"
              >
                <PlaneTakeoff className="inline-block mr-2" />
                Flying from
              </Label>
              <input
                type="text"
                id="from"
                value={fromCity}
                autoComplete="off"
                onChange={(e) => {
                  setFromCity(e.target.value);
                  handleCityInput(e.target.value);
                }}
                onFocus={() => setInputFocus('from')}
                placeholder="Enter city or airport code"
                className="mt-2 w-full px-3 xs:px-4 py-3 xs:py-4 rounded-[12px] border border-gray-300 focus:outline-none text-sm xs:text-base"
              />
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
                          // setFromCityCountryCode(city.CountryCode);
                          setShowSuggestions(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.CityName}, {city.CountryName} - {city.AirportName}{' '}
                        ({city.AirportCode})
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-center">No results found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Swap Button - Between From and To */}
            <div className="flex justify-end md:justify-center -mt-3 -mb-8 md:mt-6 md:mb-0">
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
            <div className="flex-1 w-full">
              <Label
                htmlFor="to"
                className="text-gray-700 mb-1 block sm:text-base text-sm"
              >
                <PlaneLanding className="inline-block mr-2" />
                Flying to
              </Label>
              <input
                type="text"
                id="to"
                value={toCity}
                autoComplete="off"
                onChange={(e) => {
                  setToCity(e.target.value);
                  handleCityInput(e.target.value);
                }}
                onFocus={() => setInputFocus('to')}
                placeholder="Enter city or airport code"
                className="mt-2 w-full px-3 xs:px-4 py-3 xs:py-4 rounded-[12px] border border-gray-300 focus:outline-none text-sm xs:text-base"
              />

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
                          setShowSuggestions(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.CityName}, {city.CountryName} - {city.AirportName}{' '}
                        ({city.AirportCode})
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-center">No results found</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Date Section */}
          <div className="space-y-4 xs:space-y-6">
            {/* Date Fields - Flex layout for mobile when round-trip */}
            <div
              className={`${tripType === 'round-trip' ? 'flex gap-3 xs:gap-4' : ''}`}
            >
              <div className={`${tripType === 'round-trip' ? 'flex-1' : ''}`}>
                <Label
                  htmlFor="departure"
                  className="text-gray-700 mb-1 block sm:text-base text-sm"
                >
                  <Calendar className="inline-block mr-2" />
                  Departure
                </Label>
                <DatePicker
                  className="mt-2 w-full px-3 xs:px-4 py-3 xs:py-4 border border-gray-300 rounded-[12px] focus:outline-none text-sm xs:text-base"
                  placeholder="Select date"
                  value={onwardDate}
                  disabledDate={(current) => {
                    return current && current.isBefore(dayjs().startOf('day'));
                  }}
                  onChange={(date) => setOnwardDate(date)}
                />
              </div>

              {/* Return Date - Only show for round-trip */}
              {tripType === 'round-trip' && (
                <div className="flex-1">
                  <Label
                    htmlFor="return"
                    className="text-gray-700 mb-1 block sm:text-base text-sm"
                  >
                    <Calendar className="inline-block mr-2" />
                    Return
                  </Label>
                  <DatePicker
                    className="mt-2 w-full px-3 xs:px-4 py-3 xs:py-4 border border-gray-300 rounded-[12px] focus:outline-none text-sm xs:text-base"
                    placeholder="Select date"
                    value={returnDate}
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
                </div>
              )}
            </div>

            {/* Travelers & Class */}
            <div>
              <Label className="text-gray-700 mb-1 block sm:text-base text-sm">
                <User className="inline-block mr-2" />
                Travellers & Class
              </Label>
              <TravelersDropdown
                travelers={travelers}
                travelClass={travelClass}
                onUpdate={handleTravelersUpdate}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="w-full md:w-auto px-6 xs:px-8 py-4 xs:py-5 rounded-full transition-all font-semibold text-sm xs:text-base bg-[#BC1110] hover:bg-[#BC1110]/90 text-white"
            >
              Search Flights
              <Plane className="ml-2" />
            </Button>
          </div>
        </form>
      </div>
      <Modal open={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)}>
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
  );
}
