'use client';

import { useState, useCallback } from 'react';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import {
  MapPin,
  ChevronDown,
  Plus,
  Minus,
  Calendar,
  Users,
  Search,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Modal } from '../ui/modal';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
import { useHotelStore } from '../../stores/hotelStore';
import { v4 as uuidv4 } from 'uuid';

interface Room {
  id: number;
  adults: number;
  children: number;
  childAges: number[];
}

export function HotelSearch() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs());
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, adults: 2, children: 0, childAges: [] },
  ]);
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { cities, fetchCities, isLoading } = useHotelStore();

  const formDisabled = true;

  const totalRooms = rooms.length;
  const totalGuests = rooms.reduce(
    (sum, room) => sum + room.adults + room.children,
    0
  );

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleLocationChange = useCallback(
    debounce((value: string) => {
      if (value.trim().length > 2) {
        fetchCities(value);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const updateRoom = (
    roomId: number,
    field: 'adults' | 'children',
    increment: boolean
  ) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const currentValue = room[field];
          let newValue = increment
            ? currentValue + 1
            : Math.max(0, currentValue - 1);

          // Enforce maximum 5 adults per room
          if (field === 'adults' && newValue > 5) {
            newValue = 5;
          }

          // Enforce maximum 4 children per room
          if (field === 'children' && newValue > 4) {
            newValue = 4;
          }

          // Enforce maximum 5 total guests per room
          const totalGuests =
            field === 'adults'
              ? newValue + room.children
              : room.adults + newValue;

          if (totalGuests > 5) {
            newValue = field === 'adults' ? 5 - room.children : 5 - room.adults;
          }

          let newChildAges = [...room.childAges];
          if (field === 'children') {
            if (increment) {
              newChildAges.push(0);
            } else {
              newChildAges.pop();
            }
          }

          return { ...room, [field]: newValue, childAges: newChildAges };
        }
        return room;
      })
    );
  };

  const updateChildAge = (roomId: number, childIndex: number, age: number) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const newChildAges = [...room.childAges];
          newChildAges[childIndex] = Math.min(12, Math.max(0, age));
          return { ...room, childAges: newChildAges };
        }
        return room;
      })
    );
  };

  const addRoom = () => {
    // Enforce maximum 9 rooms
    if (rooms.length >= 9) {
      return;
    }
    const newRoomId = Math.max(...rooms.map((r) => r.id)) + 1;
    setRooms((prev) => [
      ...prev,
      { id: newRoomId, adults: 1, children: 0, childAges: [] },
    ]);
  };

  const removeRoom = (roomId: number) => {
    if (rooms.length > 1) {
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    }
  };

  // Extract the content for reuse
  const roomsContent = (
    <div className="p-4 space-y-4">
      {rooms.map((room, index) => (
        <div key={room.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Room {index + 1}:</h4>
            {rooms.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRoom(room.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Adult</div>
              <div className="text-sm text-gray-500">(Above 12 years)</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoom(room.id, 'adults', false)}
                disabled={room.adults <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{room.adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoom(room.id, 'adults', true)}
                disabled={room.adults >= 5 || room.adults + room.children >= 5}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Child</div>
              <div className="text-sm text-gray-500">(Below 12 years)</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoom(room.id, 'children', false)}
                disabled={room.children <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {room.children}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoom(room.id, 'children', true)}
                disabled={
                  room.children >= 4 || room.adults + room.children >= 5
                }
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {room.children > 0 && (
            <div className="space-y-2 mt-2">
              {room.childAges.map((age, childIndex) => (
                <div
                  key={childIndex}
                  className="flex items-center justify-between"
                >
                  <div className="text-sm">Child {childIndex + 1} Age</div>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={age}
                    onChange={(e) =>
                      updateChildAge(
                        room.id,
                        childIndex,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              ))}
            </div>
          )}
          {index < rooms.length - 1 && <hr className="my-4" />}
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addRoom}
        disabled={rooms.length >= 9}
        className="w-full text-nix-txt border-nix-txt hover:bg-nix-txt/10 rounded-[6px]"
      >
        Add Room
      </Button>
      <Button
        onClick={() => {
          setIsRoomsOpen(false);
          setIsRoomsModalOpen(false);
        }}
        className="w-full bg-nix-prime hover:bg-nix-prime/80 text-white rounded-[6px]"
      >
        Done
      </Button>
    </div>
  );

  const handleSearchHotels = () => {
    // Validation for blank fields
    if (!location.trim()) {
      setErrorMessage('Please select a destination');
      setIsErrorModalOpen(true);
      return;
    }

    if (!checkIn) {
      setErrorMessage('Please select a check-in date');
      setIsErrorModalOpen(true);
      return;
    }

    if (!checkOut) {
      setErrorMessage('Please select a checkout date');
      setIsErrorModalOpen(true);
      return;
    }

    // Validate minimum stay of 1 night
    if (checkIn && checkOut && checkOut.isSameOrBefore(checkIn, 'day')) {
      setErrorMessage(
        'Check-out date must be at least 1 day after check-in date'
      );
      setIsErrorModalOpen(true);
      return;
    }

    // Validate that location is selected from suggestions
    if (cities.length === 0 && location.trim().length > 0) {
      const isValidCity = cities.some(
        (city) =>
          location.includes(city.CityName) &&
          location.includes(city.CountryName)
      );
      if (!isValidCity && location.split(',').length < 2) {
        setErrorMessage(
          'Please select a valid destination from the suggestions'
        );
        setIsErrorModalOpen(true);
        return;
      }
    }

    const locationParts = location.split(',');
    const cityName = locationParts[0].trim();
    const countryName = locationParts[1] ? locationParts[1].trim() : '';
    const formattedLocation =
      `${cityName}, ${countryName} (${cities[0]?.CountryCode || ''})`.trim();
    const formattedLocationEncoded = encodeURIComponent(formattedLocation)
      .replace(/%28/g, '(')
      .replace(/%29/g, ')');

    const roomInfo = rooms
      .map((room) => {
        const childAges =
          room.children > 0 && room.childAges.length > 0
            ? room.childAges.join(',')
            : '0';
        return `${room.id}|${room.adults}|${room.children}|${childAges}`;
      })
      .join('$');

    const url = new URL('https://fares.nixtour.com/Metabook/Home/Landing');

    const params = {
      CompanyId: 'KN2182',
      LanguageCode: 'GB',
      websiteId: '13671',
      ClientId: '',
      SalesChannel: 'ONLINE-DC',
      AgentName: '',
      SearchType: 'hotel',
      Htlcity: formattedLocationEncoded,
      Checkin: checkIn ? checkIn.format('DD-MMM-YYYY') : '',
      Checkout: checkOut ? checkOut.format('DD-MMM-YYYY') : '',
      Rooms: rooms.length.toString(),
      RoomInfo: roomInfo,
      Star: '',
      CustomerRequestedCurrency: 'INR',
      Nationality: 'IN',
      COR: 'IN',
    };

    const queryString = Object.entries(params)
      .map(([key, value]) =>
        key === 'RoomInfo' ? `${key}=${value}` : `${key}=${value}`
      )
      .join('&');
    const finalUrl = `${url.origin}${url.pathname}?${queryString}`;
    window.location.href = finalUrl;
  };

  //   return (
  //     <div className="bg-transparent backdrop-blur-[2px] w-full h-full flex items-center justify-center mt-8 text-lg">
  //       Coming Soon...
  //     </div>
  //   );

  return (
    <>
      {true && (
        <div className="flex justify-center w-full mt-8 px-4">
          <div className="flex flex-col md:flex-row bg-white rounded-[18px] shadow-lg  w-full items-stretch">
            {/* Location */}
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-nix-txt" />
                <span className="text-sm text-gray-500">
                  Where are you going?
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={location}
                  disabled={formDisabled}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleLocationChange(e.target.value);
                  }}
                  className="mt-2 w-full px-4 py-3 md:py-4 pl-10 rounded-[12px] border border-gray-300 focus:outline-none text-base md:text-lg font-medium"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/3" />
                {showSuggestions && !formDisabled && (
                  <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md mt-2 max-h-60 overflow-auto w-full">
                    {isLoading ? (
                      <li className="p-2 text-center">Loading...</li>
                    ) : cities.length > 0 ? (
                      cities.map((city) => (
                        <li
                          key={uuidv4()}
                          onClick={() => {
                            setLocation(
                              `${city.CityName}, ${city.CountryName}`
                            );
                            setShowSuggestions(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.CityName}, {city.CountryName}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-center">No results found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            {/* Check-in */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-nix-txt" />
                <span className="text-sm text-gray-500">Check-In</span>
              </div>
              <DatePicker
                value={checkIn}
                onChange={setCheckIn}
                placeholder="Select date"
                format="DD MMM YYYY"
                disabled={formDisabled}
                className="mt-2 w-full px-4 py-3 md:py-4 rounded-[12px] border border-gray-300 focus:outline-none"
                suffixIcon={null}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%',
                }}
                inputReadOnly
                renderExtraFooter={() => null}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs(), 'day')
                }
              />
            </div>
            {/* Check-out */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-nix-txt" />
                <span className="text-sm text-gray-500">Check-Out</span>
              </div>
              <DatePicker
                value={checkOut}
                onChange={setCheckOut}
                placeholder="Select date"
                format="DD MMM YYYY"
                disabled={formDisabled}
                className="mt-2 w-full px-4 py-3 md:py-4 rounded-[12px] border border-gray-300 focus:outline-none"
                suffixIcon={null}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%',
                }}
                inputReadOnly
                renderExtraFooter={() => null}
                disabledDate={(current) => {
                  if (!current) return false;
                  return (
                    current.isBefore(dayjs(), 'day') ||
                    (checkIn ? current.isSameOrBefore(checkIn, 'day') : false)
                  );
                }}
              />
            </div>
            {/* Rooms & Guests */}
            {/* Desktop Popover */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex-col justify-center min-w-[220px] hidden md:flex">
              <Popover open={isRoomsOpen} onOpenChange={setIsRoomsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal p-0 h-auto"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-nix-txt" />
                        <span className="text-sm text-gray-500">
                          Rooms & Guests
                        </span>
                      </div>
                      <div className="flex items-center gap-2 border border-gray-300 rounded-[12px] p-3 w-full">
                        <span className="text-xl md:text-2xl font-bold">
                          {totalRooms}
                        </span>
                        <span className="text-sm">Room</span>
                        <span className="text-xl md:text-2xl font-bold">
                          {totalGuests}
                        </span>
                        <span className="text-sm">Guests</span>
                        <ChevronDown className="h-4 w-4 ml-1 text-nix-txt" />
                      </div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100vw-2rem)] md:w-80 p-0"
                  align="center"
                >
                  {roomsContent}
                </PopoverContent>
              </Popover>
            </div>
            {/* Mobile Modal */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center min-w-[220px] md:hidden">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal p-0 h-auto"
                disabled={formDisabled}
                onClick={() => setIsRoomsModalOpen(true)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-nix-txt" />
                    <span className="text-sm text-gray-500">
                      Rooms & Guests
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border border-gray-300 rounded-[12px] p-3 w-full">
                    <span className="text-xl md:text-2xl font-bold">
                      {totalRooms}
                    </span>
                    <span className="text-sm">Room</span>
                    <span className="text-xl md:text-2xl font-bold">
                      {totalGuests}
                    </span>
                    <span className="text-sm">Guests</span>
                    <ChevronDown className="h-4 w-4 ml-1 text-nix-txt" />
                  </div>
                </div>
              </Button>
              <Modal
                open={isRoomsModalOpen && !formDisabled}
                onClose={() => setIsRoomsModalOpen(false)}
              >
                {roomsContent}
              </Modal>
            </div>
            {/* Search Button */}
            <div className="flex items-center">
              <Button
                onClick={handleSearchHotels}
                disabled={formDisabled}
                className="w-full md:w-auto h-full bg-nix-prime rounded-b-[18px] md:rounded-b-none md:rounded-r-[18px] hover:bg-red-700 text-white font-bold px-6 md:px-10 py-4 md:py-0 text-base md:text-lg flex items-center justify-center gap-2 shadow-none border-0"
              >
                <Search className="h-5 w-5" />
                SEARCH
              </Button>
            </div>
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
                className="w-full bg-nix-prime hover:bg-nix-prime/80 text-white rounded-[6px]"
              >
                OK
              </Button>
            </div>
          </Modal>
        </div>
      )}

      <div className="bg-tansparent absolute backdrop-blur-[2px] w-auto py-4 left-0 right-0 top-0 bottom-0 flex items-center justify-center font-semibold sm:text-xl md:text-3xl lg:text-6xl rounded-2xl">
        <span
          className="inline-flex items-center text-nix-prime font-bold transition duration-300 ease-in-out hover:text-nix-prime-hover"
          style={{
            textShadow: `
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff
                    `,
          }}
        >
          Coming Soon...{' '}
          {/* <MapPin className="size-7 xs:size-8 sm:size-8 md:size-10 lg:size-12 ml-0.5 sm:ml-1 stroke-1 stroke-white fill-nix-prime hover:fill-nix-prime-hover transition duration-300 ease-in-out" /> */}
        </span>{' '}
      </div>
    </>
  );
}
