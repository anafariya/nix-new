
import 'swiper/css';
import { MapPin, LucideLoader } from 'lucide-react';
import HolidaySearchBar from './HolidaySearchBar';
import { useState } from 'react';

export default function HolidayEngine() {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <div className="relative w-full bg-white">
      {/* Loading Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="text-center text-nix-prime flex flex-col items-center">
              <p className="text-xl font-semibold mb-2">Searching for holiday packages...</p>
              <LucideLoader className="animate-spin size-10" />
            </div>
          </div>
        </div>
      )}
      {/* Blue header section */}
      <div className="bg-[#2073C7] py-10 xs:py-12 sm:py-14 md:py-16 text-center relative">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-3 xs:px-4 leading-tight">
          Book Your{' '}
          <span
            className="inline-flex items-center text-nix-prime font-bold transition duration-300 ease-in-out hover:text-nix-prime-hover"
            style={{
              textShadow: `
                -1px -1px 0 #fff, 1px -1px 0 #fff,
                -1px 1px 0 #fff, 1px 1px 0 #fff
              `,
            }}
          >
            Trip{' '}
            <MapPin className="size-5 xs:size-6 sm:size-7 md:size-10 lg:size-12 ml-0.5 sm:ml-1 stroke-1 stroke-white fill-nix-prime hover:fill-nix-prime-hover transition duration-300 ease-in-out" />
          </span>{' '}
          With Nixtour
        </h1>

        <p className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white px-3 xs:px-4">
          Your perfect holiday package starts here!
        </p>

        {/* Search bar positioned at bottom of blue section */}
        <div className="absolute -bottom-6 xs:-bottom-8 left-0 right-0 flex justify-center px-3 xs:px-4">
          <div className="w-full max-w-[95%] xs:max-w-[90%] md:max-w-4xl">
            <HolidaySearchBar 
              onSearchStart={() => setIsSearching(true)} 
              onSearchEnd={() => setIsSearching(false)} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white pt-4 xs:pt-6 sm:pt-8 md:pt-10">
      
      </div>
    </div>
  );
}
