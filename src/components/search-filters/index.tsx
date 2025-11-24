import { useState } from 'react';
// import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';

import { timeOptions } from './filterOptions';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';

type FlightFiltersProps = {
  setFilters: React.Dispatch<
    React.SetStateAction<{
      departureTimeRange: { start: string; end: string };
      arrivalTimeRange: { start: string; end: string };
      priceRange: [number, number];
      stops: {
        nonStop: Boolean;
        oneStop: Boolean;
        twoPlusStop: Boolean;
      };
      airline: string;
      duration: string;
      directFlight: boolean;
      returnDepartureTimeRange?: { start: string; end: string };
      returnArrivalTimeRange?: { start: string; end: string };
      returnPriceRange?: [number, number];
      returnStops?: {
        nonStop: Boolean;
        oneStop: Boolean;
        twoPlusStop: Boolean;
      };
      returnAirline?: string;
      returnDuration?: string;
      returnDirectFlight?: boolean;
    }>
  >;
  airLines?: { name: string; code: string }[];
};

// Utility for classnames
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export const FlightFilters: React.FC<FlightFiltersProps> = ({
  setFilters,
  airLines,
}) => {
  // const [filters, setLocalFilters] = useState({
  //   departureTimeRange: { start: '', end: '' },
  //   arrivalTimeRange: { start: '', end: '' },
  //   priceRange: [Number, Number],
  //   stops: {
  //     nonStop: true,
  //     oneStop: true,
  //     twoPlusStop: true,
  //   },
  //   airline: '',
  //   duration: 'any',
  //   directFlight: false,
  // });

  const [selectedFilters, setSelectedFilters] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [stops, setStops] = useState({
    nonStop: true,
    oneStop: true,
    twoPlusStop: true,
  });
  const [departureTimeRange, setDepartureTimeRange] = useState<{
    start: string;
    end: string;
  }>({ start: '', end: '' });
  const [arrivalTimeRange, setArrivalTimeRange] = useState<{
    start: string;
    end: string;
  }>({ start: '', end: '' });

  const [selectedAirline, setAirline] = useState('');
  // const [duration, setDuration] = useState('any');
  // const [directFlight, setDirectFlight] = useState(false);

  // Return Flight Filters
  const [returnPriceRange, setReturnPriceRange] = useState<[number, number]>([
    0, 1000000,
  ]);
  const [returnStops, setReturnStops] = useState({
    nonStop: true,
    oneStop: true,
    twoPlusStop: true,
  });
  const [returnDepartureTimeRange, setReturnDepartureTimeRange] = useState<{
    start: string;
    end: string;
  }>({ start: '', end: '' });
  const [returnArrivalTimeRange, setReturnArrivalTimeRange] = useState<{
    start: string;
    end: string;
  }>({ start: '', end: '' });

  const [returnAirline, setReturnAirline] = useState('');

  const tripType = sessionStorage.getItem('tripType');

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4 md:mt-10">
      {/* Desktop View — Sidebar */}
      {sessionStorage.getItem('tripType') === 'round-trip' && (
        <div className="hidden md:flex gap-1 w-full p-1 bg-blue-600 text-white font-semibold">
          <button
            onClick={() => setSelectedFilters(0)}
            className={
              selectedFilters === 0 ? 'flex-1 bg-white text-blue-600' : 'flex-1'
            }
          >
            Onwards Filter
          </button>
          <button
            onClick={() => setSelectedFilters(1)}
            className={
              selectedFilters === 1 ? 'flex-1 bg-white text-blue-600' : 'flex-1'
            }
          >
            Return Filter
          </button>
        </div>
      )}
      {selectedFilters === 0 && (
        <div className="hidden md:block p-6 w-[340px] bg-white rounded-xl border shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">
            Filter {tripType === 'round-trip' && 'Onward'} Flights
          </h2>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Price Range
            </h4>
            <Slider
              min={0}
              max={1000000}
              step={500}
              className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-[#BC1110]"
              value={priceRange}
              onValueChange={(val) => {
                setPriceRange(val as [number, number]);
                setFilters((previous) => ({
                  ...previous,
                  priceRange: [priceRange[0], priceRange[1]],
                }));
              }}
            />
            <p className="text-sm text-muted-foreground mt-2">
              ₹{priceRange[0]} – ₹{priceRange[1]}
            </p>
          </div>

          {/* Stops */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Stops</h4>
            <div className="space-y-2">
              {[
                { label: 'Non-stop', key: 'nonStop' },
                { label: '1 Stop', key: 'oneStop' },
                { label: '2+ Stop', key: 'twoPlusStop' },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={stops[key as keyof typeof stops]}
                    color="[#BC1110]"
                    onCheckedChange={(checked) => {
                      setStops((prev) => ({
                        ...prev,
                        [key]: !!checked,
                      }));
                      setFilters((previous) => ({
                        ...previous,
                        stops: { ...stops, [key]: !!checked },
                      }));
                    }}
                  />
                  <label htmlFor={key} className="text-sm">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Departure Time
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDepartureTimeRange((prev) =>
                      prev.start === option.value.start
                        ? { start: '', end: '' }
                        : option.value
                    );

                    setFilters((previous) => ({
                      ...previous,
                      departureTimeRange:
                        previous.departureTimeRange.start === option.value.start
                          ? { start: '', end: '' }
                          : option.value,
                    }));
                  }}
                  className={cn(
                    'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                    departureTimeRange.start === option.value.start
                      ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                      : 'hover:bg-muted'
                  )}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Arrival Time */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Arrival Time
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setArrivalTimeRange((prev) =>
                      prev.start === option.value.start
                        ? { start: '', end: '' }
                        : option.value
                    );

                    setFilters((previous) => ({
                      ...previous,
                      arrivalTimeRange:
                        previous.arrivalTimeRange.start === option.value.start
                          ? { start: '', end: '' }
                          : option.value,
                    }));
                  }}
                  className={cn(
                    'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                    arrivalTimeRange.start === option.value.start
                      ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                      : 'hover:bg-muted'
                  )}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Airline Select */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Airline
            </h4>
            <Select
              onValueChange={(val) => {
                handleSelectChange('airline', val);
                setAirline(val);
              }}
              value={selectedAirline}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Airline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="Any" value="Any">
                  Any
                </SelectItem>
                {airLines?.map((airline) => (
                  <SelectItem key={airline.code} value={airline.code}>
                    {airline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {tripType === 'round-trip' && selectedFilters === 1 && (
        <>
          {/* Desktop View — Sidebar */}
          <div className="hidden md:block p-6 w-[340px] bg-white rounded-xl border shadow-sm space-y-6">
            <h2 className="text-xl font-semibold">Filter Return Flights</h2>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Price Range
              </h4>
              <Slider
                min={0}
                max={1000000}
                step={500}
                className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-[#BC1110]"
                value={returnPriceRange}
                onValueChange={(val) => {
                  setReturnPriceRange(val as [number, number]);
                  setFilters((previous) => ({
                    ...previous,
                    returnPriceRange: [
                      returnPriceRange[0],
                      returnPriceRange[1],
                    ],
                  }));
                }}
              />
              <p className="text-sm text-muted-foreground mt-2">
                ₹{returnPriceRange[0]} – ₹{returnPriceRange[1]}
              </p>
            </div>

            {/* Stops */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Stops
              </h4>
              <div className="space-y-2">
                {[
                  { label: 'Non-stop', key: 'nonStop' },
                  { label: '1 Stop', key: 'oneStop' },
                  { label: '2+ Stop', key: 'twoPlusStop' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={returnStops[key as keyof typeof returnStops]}
                      color="[#BC1110]"
                      onCheckedChange={(checked) => {
                        setReturnStops((prev) => ({
                          ...prev,
                          [key]: !!checked,
                        }));
                        setFilters((previous) => ({
                          ...previous,
                          returnStops: { ...returnStops, [key]: !!checked },
                        }));
                      }}
                    />
                    <label htmlFor={key} className="text-sm">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Departure Time
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setReturnDepartureTimeRange((prev) =>
                        prev.start === option.value.start
                          ? { start: '', end: '' }
                          : option.value
                      );

                      setFilters((previous) => ({
                        ...previous,
                        returnDepartureTimeRange:
                          previous.returnDepartureTimeRange?.start ===
                          option.value.start
                            ? { start: '', end: '' }
                            : option.value,
                      }));
                    }}
                    className={cn(
                      'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                      returnDepartureTimeRange.start === option.value.start
                        ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                        : 'hover:bg-muted'
                    )}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Arrival Time */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Arrival Time
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setReturnArrivalTimeRange((prev) =>
                        prev.start === option.value.start
                          ? { start: '', end: '' }
                          : option.value
                      );

                      setFilters((previous) => ({
                        ...previous,
                        returnArrivalTimeRange:
                          previous.returnArrivalTimeRange?.start ===
                          option.value.start
                            ? { start: '', end: '' }
                            : option.value,
                      }));
                    }}
                    className={cn(
                      'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                      returnArrivalTimeRange.start === option.value.start
                        ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                        : 'hover:bg-muted'
                    )}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Airline Select */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Airline
              </h4>
              <Select
                value={returnAirline}
                onValueChange={(val) => {
                  handleSelectChange('returnAirline', val);
                  setReturnAirline(val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Airline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="Any" value="Any">
                    Any
                  </SelectItem>
                  {airLines?.map((airline) => (
                    <SelectItem key={airline.code} value={airline.code}>
                      {airline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      {/* Mobile View — Sheet / Drawer */}
      <div className="block md:hidden fixed bottom-6 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="rounded-full h-12 w-12 p-0 shadow-lg bg-[#BC1110] hover:bg-[#a20e0d]">
              <Filter className="w-5 h-5 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="p-6 max-h-[85vh] max-w-[95dvw] mx-auto my-auto overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] rounded-t-2xl"
          >
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <div className="p-6 mx-auto bg-white rounded-xl shadow-sm space-y-6 border my-6">
              <h2 className="text-xl font-semibold">
                Filter {tripType === 'round-trip' && 'Onward'} Flights
              </h2>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Price Range
                </h4>
                <Slider
                  min={0}
                  max={1000000}
                  step={500}
                  className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-[#BC1110]"
                  value={priceRange}
                  onValueChange={(val) => {
                    setPriceRange(val as [number, number]);
                    setFilters((previous) => ({
                      ...previous,
                      priceRange: [priceRange[0], priceRange[1]],
                    }));
                  }}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  ₹{priceRange[0]} – ₹{priceRange[1]}
                </p>
              </div>

              {/* Stops */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Stops
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Non-stop', key: 'nonStop' },
                    { label: '1 Stop', key: 'oneStop' },
                    { label: '2+ Stop', key: 'twoPlusStop' },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={stops[key as keyof typeof stops]}
                        color="[#BC1110]"
                        onCheckedChange={(checked) => {
                          setStops((prev) => ({
                            ...prev,
                            [key]: !!checked,
                          }));
                          setFilters((previous) => ({
                            ...previous,
                            stops: { ...stops, [key]: !!checked },
                          }));
                        }}
                      />
                      <label htmlFor={key} className="text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departure Time */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Departure Time
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {timeOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDepartureTimeRange((prev) =>
                          prev.start === option.value.start
                            ? { start: '', end: '' }
                            : option.value
                        );

                        setFilters((previous) => ({
                          ...previous,
                          departureTimeRange:
                            previous.departureTimeRange.start ===
                            option.value.start
                              ? { start: '', end: '' }
                              : option.value,
                        }));
                      }}
                      className={cn(
                        'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                        departureTimeRange.start === option.value.start
                          ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrival Time */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Arrival Time
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {timeOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setArrivalTimeRange((prev) =>
                          prev.start === option.value.start
                            ? { start: '', end: '' }
                            : option.value
                        );

                        setFilters((previous) => ({
                          ...previous,
                          arrivalTimeRange:
                            previous.arrivalTimeRange.start ===
                            option.value.start
                              ? { start: '', end: '' }
                              : option.value,
                        }));
                      }}
                      className={cn(
                        'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                        arrivalTimeRange.start === option.value.start
                          ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Airline Select */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Airline
                </h4>
                <Select
                  onValueChange={(val) => {
                    handleSelectChange('airline', val);
                    setAirline(val);
                  }}
                  value={selectedAirline}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Airline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="Any" value="Any">
                      Any
                    </SelectItem>
                    {airLines?.map((airline) => (
                      <SelectItem key={airline.code} value={airline.code}>
                        {airline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {tripType === 'round-trip' && (
              <>
                {/* Mobile View — Sheet / Drawer */}
                <div className="p-6 mx-auto bg-white rounded-xl shadow-sm space-y-6 border my-4">
                  <h2 className="text-xl font-semibold">
                    Filter Return Flights
                  </h2>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Price Range
                    </h4>
                    <Slider
                      min={0}
                      max={1000000}
                      step={500}
                      className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-[#BC1110]"
                      value={returnPriceRange}
                      onValueChange={(val) => {
                        setReturnPriceRange(val as [number, number]);
                        setFilters((previous) => ({
                          ...previous,
                          returnPriceRange: [
                            returnPriceRange[0],
                            returnPriceRange[1],
                          ],
                        }));
                      }}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      ₹{returnPriceRange[0]} – ₹{returnPriceRange[1]}
                    </p>
                  </div>

                  {/* Stops */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Stops
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Non-stop', key: 'nonStop' },
                        { label: '1 Stop', key: 'oneStop' },
                        { label: '2+ Stop', key: 'twoPlusStop' },
                      ].map(({ label, key }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={stops[key as keyof typeof stops]}
                            color="[#BC1110]"
                            onCheckedChange={(checked) => {
                              setReturnStops((prev) => ({
                                ...prev,
                                [key]: !!checked,
                              }));
                              setFilters((previous) => ({
                                ...previous,
                                returnStops: {
                                  ...returnStops,
                                  [key]: !!checked,
                                },
                              }));
                            }}
                          />
                          <label htmlFor={key} className="text-sm">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Departure Time */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Departure Time
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {timeOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setReturnDepartureTimeRange((prev) =>
                              prev.start === option.value.start
                                ? { start: '', end: '' }
                                : option.value
                            );

                            setFilters((previous) => ({
                              ...previous,
                              returnDepartureTimeRange:
                                previous.returnDepartureTimeRange?.start ===
                                option.value.start
                                  ? { start: '', end: '' }
                                  : option.value,
                            }));
                          }}
                          className={cn(
                            'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                            returnDepartureTimeRange.start ===
                              option.value.start
                              ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                              : 'hover:bg-muted'
                          )}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Arrival Time
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {timeOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setReturnArrivalTimeRange((prev) =>
                              prev.start === option.value.start
                                ? { start: '', end: '' }
                                : option.value
                            );

                            setFilters((previous) => ({
                              ...previous,
                              returnArrivalTimeRange:
                                previous.returnArrivalTimeRange?.start ===
                                option.value.start
                                  ? { start: '', end: '' }
                                  : option.value,
                            }));
                          }}
                          className={cn(
                            'border rounded-md p-2 text-xs flex flex-col items-center text-center transition shadow-sm',
                            returnArrivalTimeRange.start === option.value.start
                              ? 'bg-blue-100 border-blue-500 text-blue-700 ring-1 ring-blue-300'
                              : 'hover:bg-muted'
                          )}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Airline Select */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Airline
                    </h4>
                    <Select
                      value={returnAirline}
                      onValueChange={(val) => {
                        handleSelectChange('returnAirline', val);
                        setReturnAirline(val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Airline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="Any" value="Any">
                          Any
                        </SelectItem>
                        {airLines?.map((airline) => (
                          <SelectItem key={airline.code} value={airline.code}>
                            {airline.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
