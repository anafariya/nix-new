import { useState, useCallback } from "react";
import { DatePicker } from "antd";
import { TravelersDropdown } from "../travellers-dropdown/travellers-dropdown";
import {  Plane } from 'lucide-react';
import type { Travelers, TravelClass } from "../../../types/booking";
import { useCitiesStore } from "../../../stores/flightStore";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

const BookEngine = () => {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("round-trip");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [onwardDate, setOnwardDate] = useState<dayjs.Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<dayjs.Dayjs | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromCityCountryCode, setFromCityCountryCode] = useState("");
  const [toCityCountryCode, setToCityCountryCode] = useState("");
  const [inputFocus, setInputFocus] = useState<"from" | "to" | null>(null);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState<TravelClass>("Economy");

  const { cities, fetchCities, isLoading } = useCitiesStore();
  const [showReturn, setShowReturn] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTravelersUpdate = (newTravelers: Travelers, newClass: TravelClass) => {
    setTravelers(newTravelers);
    setTravelClass(newClass);
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
      setErrorMessage("Please select departure city");
      setIsErrorModalOpen(true);
      return;
    }
    
    if (!toCity.trim()) {
      setErrorMessage("Please select destination city");
      setIsErrorModalOpen(true);
      return;
    }
    
    if (!onwardDate) {
      setErrorMessage("Please select departure date");
      setIsErrorModalOpen(true);
      return;
    }
    
    if (tripType === "round-trip" && !returnDate) {
      setErrorMessage("Please select return date for round trip");
      setIsErrorModalOpen(true);
      return;
    }
    
    const fromAirportCode = fromCity.match(/\(([^)]+)\)/)?.[1] || "";
    const toAirportCode = toCity.match(/\(([^)]+)\)/)?.[1] || "";
    
    if (!fromAirportCode) {
      setErrorMessage("Please select a valid departure city from the suggestions");
      setIsErrorModalOpen(true);
      return;
    }
    
    if (!toAirportCode) {
      setErrorMessage("Please select a valid destination city from the suggestions");
      setIsErrorModalOpen(true);
      return;
    }

    const url = new URL("https://fares.nixtour.com/Metabook/Home/Landing");
    const params: { [key: string]: string } = {
        CompanyId: "KN2182",
        LanguageCode: "GB",
        FlightMode: "I",
        JourneyType: tripType === "round-trip" ? "R" : "O",
        websiteId: "13671",
        ClientId: "",
        SalesChannel: "Online-DC",
        AgentName: "",
        SearchType: "Flight",
        CabinClass: travelClass === "Economy" ? "3" : travelClass === "Business" ? "2" : travelClass === "First Class" ? "1" : "4",
        Dep: fromAirportCode,
        Arr: toAirportCode,
        DepDt: onwardDate ? onwardDate.format("DD-MMM-YYYY") : "",
        RetDt: returnDate ? returnDate.format("DD-MMM-YYYY") : "",
        Adt: travelers.adults.toString(),
        Chd: travelers.children.toString(),
        Inf: travelers.infants.toString(),
        cl: travelClass === "Economy" ? "3" : travelClass === "Business" ? "2" : travelClass === "First Class" ? "1" : "4",
        DirectFlight: "False",
        IntAirline: "",
        DepCity: fromCity,
        ArrCity: toCity,
        LCCRTChkBox: "",
        DepDate: onwardDate ? onwardDate.format("DD-MMM-YYYY") : "",
        RetDate: returnDate ? returnDate.format("DD-MMM-YYYY") : "",
        Airline: "",
        Flexi: "False",
        comp_currency: "INR",
        uid: uuidv4(),
        DepCountryCode: fromCityCountryCode,
        ArrCountryCode: toCityCountryCode,
        IsLogin: "false",
        BranchId: "2214"
    };

    Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key as keyof typeof params] as string)
    );

    console.log("Final URL:", url.toString());
    window.location.href = url.toString();
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto rounded-lg bg-white/30 p-4 shadow-lg border border-white/30">
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleSearchFlights();
        }}>
          {/* Trip Type Selection */}
          <div className="flex gap-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#BC1110]"
                name="tripType"
                value="one-way"
                checked={tripType === "one-way"}
                onChange={(e) => {
                  setTripType(e.target.value as "one-way" | "round-trip");
                  setShowReturn(false);
                  if (e.target.value !== "round-trip") {
                    setReturnDate(null);
                  }
                }}
              />
              <span className="ml-2">One Way</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#BC1110]"
                name="tripType"
                value="round-trip"
                checked={tripType === "round-trip"}
                onChange={(e) => {
                  setTripType(e.target.value as "one-way" | "round-trip");
                  setShowReturn(true);
                }}
              />
              <span className="ml-2">Round Trip</span>
            </label>
          </div>

          {/* First Row - From, To, Dates */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {/* From */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    handleCityInput(e.target.value);
                  }}
                  onFocus={() => setInputFocus("from")}
                  placeholder="From"
                  className="w-full px-4 py-4 rounded-[12px] border border-gray-300 focus:outline-none"
                />
              </div>
              {/* City Suggestions Dropdown */}
              {showSuggestions && inputFocus === "from" && (
                <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md mt-2 max-h-60 overflow-auto w-auto">
                  {isLoading ? (
                    <li className="p-2 text-center">Loading...</li>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <li
                        key={uuidv4()}
                        onClick={() => {
                          setFromCity(`${city.CityName}, ${city.CountryName} - ${city.AirportName} (${city.AirportCode})`);
                          setFromCityCountryCode(city.CountryCode);
                          setShowSuggestions(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.CityName}, {city.CountryName} - {city.AirportName} ({city.AirportCode})
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-center">No results found</li>
                  )}
                </ul>
              )}
            </div>

            {/* To */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    handleCityInput(e.target.value);
                  }}
                  onFocus={() => setInputFocus("to")}
                  placeholder="To"
                  className="w-full px-4 py-4 rounded-[12px] border border-gray-300 focus:outline-none"
                />
              </div>
              {/* City Suggestions Dropdown */}
              {showSuggestions && inputFocus === "to" && (
                <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md mt-2 max-h-60 overflow-auto w-auto">
                  {isLoading ? (
                    <li className="p-2 text-center">Loading...</li>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <li
                        key={uuidv4()}
                        onClick={() => {
                          setToCity(`${city.CityName}, ${city.CountryName} - ${city.AirportName} (${city.AirportCode})`);
                          setToCityCountryCode(city.CountryCode);
                          setShowSuggestions(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.CityName}, {city.CountryName} - {city.AirportName} ({city.AirportCode})
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-center">No results found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Departure Date */}
            <DatePicker
              className="w-full px-4 py-4 border border-gray-300 rounded-[12px] focus:outline-none"
              placeholder="Departure"
              disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'))}
              onChange={(date) => setOnwardDate(date)}
            />

            {/* Return Date */}
           {
            showReturn && (
                <DatePicker
                className="w-full px-4 py-4 border border-gray-300 rounded-[12px] focus:outline-none"
                placeholder="Return"
                disabledDate={(current) => {
                  return current && current.isBefore(onwardDate || dayjs().startOf('day'));
                }}
                onChange={(date) => setReturnDate(date)}
              />
            )
           }
          </div>

          {/* Second Row - Travelers & Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="">
              <TravelersDropdown
                travelers={travelers}
                travelClass={travelClass}
                onUpdate={handleTravelersUpdate}
              />
            </div>
            <Button
              type="submit"
              className="h-[52px] md:col-span-1 md:col-start-4 px-8 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-[10px] whitespace-nowrap"
            >
              Search Flights
              <Plane className="ml-2" size={20} />
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
};

// Debounce helper function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default BookEngine;