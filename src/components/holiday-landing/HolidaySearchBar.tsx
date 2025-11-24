import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';

// --- Interfaces ---
interface IDestination {
  DestinationId: string;
  DestinationName: string;
}

// --- Search Icon SVG ---
const SearchIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

interface HolidaySearchBarProps {
  onSearchStart: () => void;
  onSearchEnd: () => void;
}

// --- Helper Functions (specific to this component) ---
const parseUrlToSearchParams = (url: string) => {
  const urlSegments = url.split('/');
  const slug = urlSegments[urlSegments.length - 1];
  if (!slug) return null;

  const decodedSlug = decodeURIComponent(slug);
  const searchParams = {
    destination: '',
    themes: [] as number[],
    durations: [] as number[],
    minPrice: '0',
    maxPrice: '500000',
  };

  const themeMap: { [key: string]: number } = {
    honeymoon: 4,
    'family-friends': 3,
    adventure: 1,
    beach: 2,
    mountains: 5,
  };
  const durationMap: { [key: string]: number } = {
    '1-to-3-days': 1,
    '4-to-6-days': 2,
    '7-to-9-days': 3,
    '10-to-12-days': 4,
    '13-days': 5,
  };

  const parts = decodedSlug.toLowerCase().split(/[-\s]+/);
  const destinationEndIndex = parts.findIndex(
    (part) => part === 'trip' || part === 'for' || part === 'package'
  );
  searchParams.destination =
    destinationEndIndex > 0
      ? parts.slice(0, destinationEndIndex).join(' ')
      : parts.slice(0, 2).join(' ');

  Object.entries(themeMap).forEach(([themeName, themeId]) => {
    if (themeName.split('-').every((part) => parts.includes(part))) {
      searchParams.themes.push(themeId);
    }
  });

  Object.entries(durationMap).forEach(([durationName, durationId]) => {
    if (durationName.split('-').every((part) => parts.includes(part))) {
      searchParams.durations.push(durationId);
    }
  });

  const priceIndex = parts.findIndex((part) => part === 'price');
  if (priceIndex !== -1 && priceIndex + 1 < parts.length) {
    const priceMatch = parts
      .slice(priceIndex + 1)
      .join('-')
      .match(/(\d+)-to-(\d+)/);
    if (priceMatch) {
      searchParams.minPrice = priceMatch[1];
      searchParams.maxPrice = priceMatch[2];
    }
  }
  return searchParams;
};

const enhancedSlugify = (
  destination: string,
  themes: number[],
  durations: number[],
  minPrice: string,
  maxPrice: string
) => {
  const themeNames: { [key: number]: string } = {
    4: 'honeymoon',
    3: 'family-friends',
    1: 'adventure',
    2: 'beach',
    5: 'mountains',
  };
  const durationNames: { [key: number]: string } = {
    1: '1-to-3-days',
    2: '4-to-6-days',
    3: '7-to-9-days',
    4: '10-to-12-days',
    5: '13-days',
  };

  let slug = `${destination
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')}-trip`;

  if (themes.length > 0) {
    const themeStrings = themes.map((id) => themeNames[id]).filter(Boolean);
    if (themeStrings.length > 0) slug += `-for-${themeStrings.join('-')}`;
  }
  if (durations.length > 0) {
    const durationStrings = durations
      .map((id) => durationNames[id])
      .filter(Boolean);
    if (durationStrings.length > 0) slug += `-for-${durationStrings.join('-')}`;
  }
  if (minPrice && maxPrice) {
    slug += `-between-price-${minPrice}-to-${maxPrice}`;
  }
  return encodeURIComponent(slug);
};

const getDestinationIdFromName = async (destinationName: string) => {
  try {
    const response = await axios.get(
      `https://api.nixtour.com/api/TextSearch/Destinations?searchText=${destinationName}`
    );
    if (response.data?.Data?.length > 0) {
      const exactMatch = response.data.Data.find(
        (dest: IDestination) =>
          dest.DestinationName.toLowerCase() === destinationName.toLowerCase()
      );
      return exactMatch
        ? exactMatch.DestinationId
        : response.data.Data[0].DestinationId;
    }
    return null;
  } catch (error) {
    console.error('Error fetching destination ID:', error);
    return null;
  }
};

// --- Component ---
export default function HolidaySearchBar({
  onSearchStart,
  onSearchEnd,
}: HolidaySearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('500000');
  const [priceRange, setPriceRange] = useState(100);
  const [destinationId, setDestinationId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSearchingDestinations, setIsSearchingDestinations] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const MIN_PRICE_VALUE = 5000;
  const MAX_PRICE_VALUE = 500000;

  const themes = [
    { id: 4, name: 'Honeymoon' },
    { id: 3, name: 'Family & Friends' },
    { id: 1, name: 'Adventure' },
    { id: 2, name: 'Beach' },
    { id: 5, name: 'Mountains' },
  ];
  const durations = [
    { id: 1, name: '1 to 3 Days' },
    { id: 2, name: '4 to 6 Days' },
    { id: 3, name: '7 to 9 Days' },
    { id: 4, name: '10 to 12 Days' },
    { id: 5, name: '13+ Days' },
  ];
  const placeholderTexts = [
    'Your next journey starts here',
    'Discover amazing destinations...',
    'Where would you like to go?',
    'Find your perfect getaway...',
    'Adventure awaits you...',
  ];

  const fetchDestinations = async (searchText: string) => {
    setIsSearchingDestinations(true);
    try {
      const response = await axios.get(
        `https://api.nixtour.com/api/TextSearch/Destinations?searchText=${searchText}`
      );
      setDestinations(response.data?.Data || []);
    } catch (error) {
      console.error('Error during destination search:', error);
      setDestinations([]);
    } finally {
      setIsSearchingDestinations(false);
    }
  };

  const handleSearchInput = useCallback(
    debounce((prefix: string) => {
      if (prefix.trim().length > 2) {
        fetchDestinations(prefix);
      } else {
        setDestinations([]);
      }
    }, 300),
    []
  );

  const executeSearch = async (params: {
    DestinationId: string;
    MinPrice: string;
    MaxPrice: string;
    ThemeIdStr: string;
    DurationIdStr: string;
  }) => {
    const apiUrl = new URL(
      'https://api.nixtour.com/api/Web/HolidayFilteredSearchResult'
    );
    
    // Only add parameters that have values to avoid empty string issues
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'DestinationId' || key === 'MinPrice' || key === 'MaxPrice') {
        // Always include required parameters
        apiUrl.searchParams.append(key, value);
      } else if (value && value.trim() !== '') {
        // Only include theme/duration parameters if they have actual values
        apiUrl.searchParams.append(key, value);
      }
    });
    
    const response = await axios.get(apiUrl.toString());
    return response.data?.Data || null;
  };

  const handleSearchWithRestoredParams = async (
    destId: string,
    urlParams: any
  ) => {
    onSearchStart();
    try {
      const resultsData = await executeSearch({
        DestinationId: destId,
        MinPrice: urlParams.minPrice,
        MaxPrice: urlParams.maxPrice,
        ThemeIdStr: urlParams.themes.join(','),
        DurationIdStr: urlParams.durations.join(','),
      });
      navigate(location.pathname, {
        state: { results: resultsData, searchParams: urlParams },
        replace: true,
      });
    } catch (error) {
      console.error('Error during search with restored params:', error);
      navigate(location.pathname, {
        state: { results: null, searchParams: urlParams },
        replace: true,
      });
    } finally {
      onSearchEnd();
    }
  };

  const handleSearch = async () => {
    if (!validateForm()) return;
    setShowPopup(false);
    setIsSearching(true);
    onSearchStart();
    try {
      // Determine if filters are applied (only when user actually selects something)
      const hasFilters = selectedThemes.length > 0 || selectedDurations.length > 0 || 
                        parseInt(minPrice) !== 0 || parseInt(maxPrice) !== 500000;
      
      const resultsData = await executeSearch({
        DestinationId: destinationId,
        MinPrice: minPrice,
        MaxPrice: maxPrice,
        ThemeIdStr: selectedThemes.join(','),
        DurationIdStr: selectedDurations.join(','),
      });
      
      let navigationUrl: string;
      
      if (hasFilters) {
        // Use complex URL with filters
        const slug = enhancedSlugify(
          searchValue,
          selectedThemes,
          selectedDurations,
          minPrice,
          maxPrice
        );
        navigationUrl = `/holiday/search/${slug}`;
      } else {
        // Use simple destination-only URL
        const citySlug = searchValue.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        navigationUrl = `/holidays/${citySlug}-tour-packages`;
      }
      
      const searchParams = {
        destination: searchValue,
        destinationId,
        themes: selectedThemes,
        durations: selectedDurations,
        minPrice,
        maxPrice,
      };
      
      // For destination-only searches, open in new tab
      if (!hasFilters) {
        window.open(navigationUrl, '_blank');
      } else {
        navigate(navigationUrl, {
          state: { results: resultsData, searchParams },
        });
      }
    } catch (error) {
      console.error('Error during search:', error);
      const citySlug = searchValue.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      window.open(`/holidays/${citySlug}-tour-packages`, '_blank');
    } finally {
      setIsSearching(false);
      onSearchEnd();
    }
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/holiday/search')) return;
    const initializeFromUrl = async () => {
      const urlParams = parseUrlToSearchParams(location.pathname);
      if (urlParams && !location.state) {
        onSearchStart();
        if (urlParams.destination) {
          setSearchValue(urlParams.destination);
          const destId = await getDestinationIdFromName(urlParams.destination);
          if (destId) {
            setDestinationId(destId);
            await handleSearchWithRestoredParams(destId, urlParams);
          } else {
            onSearchEnd();
          }
        }
        if (urlParams.themes.length > 0) setSelectedThemes(urlParams.themes);
        if (urlParams.durations.length > 0)
          setSelectedDurations(urlParams.durations);
        if (urlParams.minPrice) setMinPrice(urlParams.minPrice);
        if (urlParams.maxPrice) {
          setMaxPrice(urlParams.maxPrice);
          const maxPriceNum = parseInt(urlParams.maxPrice, 10);
          if (
            !isNaN(maxPriceNum) &&
            maxPriceNum >= MIN_PRICE_VALUE &&
            maxPriceNum <= MAX_PRICE_VALUE
          ) {
            const logMin = Math.log(MIN_PRICE_VALUE);
            const logMax = Math.log(MAX_PRICE_VALUE);
            const scale = (logMax - logMin) / 100;
            setPriceRange((Math.log(maxPriceNum) - logMin) / scale);
          }
        }
      }
    };
    initializeFromUrl();
  }, [location.pathname]);

  useEffect(() => {
    const logMin = Math.log(MIN_PRICE_VALUE);
    const logMax = Math.log(MAX_PRICE_VALUE);
    const scale = (logMax - logMin) / 100;
    const newMaxPrice = Math.round(Math.exp(logMin + scale * priceRange));
    if (maxPrice !== newMaxPrice.toString()) {
      setMaxPrice(newMaxPrice.toString());
    }
  }, [priceRange]);

  useEffect(() => {
    const interval = setInterval(
      () => setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !document.getElementById('search-popup-container')?.contains(target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setDestinationId('');
    if (errors.destination) setErrors((prev) => ({ ...prev, destination: '' }));
    setShowPopup(true);
    handleSearchInput(value);
  };

  const handleDestinationSelect = (destination: IDestination) => {
    setDestinationId(destination.DestinationId);
    setSearchValue(destination.DestinationName);
    setDestinations([]);
    if (errors.destination) setErrors((prev) => ({ ...prev, destination: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!searchValue.trim() || !destinationId)
      newErrors.destination = 'Please select a destination';
    const minPriceNum = parseInt(minPrice.replace(/[^\d]/g, ''));
    const maxPriceNum = parseInt(maxPrice.replace(/[^\d]/g, ''));
    if (isNaN(minPriceNum)) newErrors.minPrice = 'Min price is required';
    if (isNaN(maxPriceNum)) newErrors.maxPrice = 'Max price is required';
    if (minPriceNum >= maxPriceNum)
      newErrors.priceRange = 'Min price must be less than max';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceInputChange = (value: string, type: 'min' | 'max') => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (type === 'min') setMinPrice(numericValue);
    else setMaxPrice(numericValue);

    if (errors.minPrice || errors.maxPrice || errors.priceRange) setErrors({});

    if (type === 'max') {
      const numericValueAsNum = parseInt(numericValue, 10);
      if (
        !isNaN(numericValueAsNum) &&
        numericValueAsNum >= MIN_PRICE_VALUE &&
        numericValueAsNum <= MAX_PRICE_VALUE
      ) {
        const logMin = Math.log(MIN_PRICE_VALUE);
        const logMax = Math.log(MAX_PRICE_VALUE);
        const scale = (logMax - logMin) / 100;
        setPriceRange((Math.log(numericValueAsNum) - logMin) / scale);
      }
    }
  };

  const handleClearAll = () => {
    setSelectedThemes([]);
    setSelectedDurations([]);
    setMinPrice('0');
    setMaxPrice('500000');
    setPriceRange(100);
    setErrors({});
  };

  const toggleHandler = (
    id: number,
    setState: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setState((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      id="search-popup-container"
      className="relative w-full max-w-[95%] xs:max-w-[90%] md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto px-3 xs:px-4"
    >
      {/* Search Input Fields */}
      <div className="block sm:hidden w-full relative">
        <SearchIcon className="absolute left-3 xs:left-4 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 xs:w-5 xs:h-5" />
        <input
          id="search-input"
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setShowPopup(true)}
          placeholder={placeholderTexts[placeholderIndex]}
          className={`w-full pl-10 xs:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 rounded-full border-2 focus:outline-none text-sm xs:text-base mb-2 ${errors.destination ? 'border-2 border-red-500' : ''}`}
        />
        {errors.destination && (
          <div className="flex items-center gap-1 text-red-500 text-xs xs:text-sm mb-2">
            <AlertCircle size={14} className="xs:w-4 xs:h-4" />
            <span>{errors.destination}</span>
          </div>
        )}
      </div>
      <div className="hidden sm:flex items-center bg-white rounded-full shadow-md overflow-hidden relative">
        <SearchIcon className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 sm:w-5 sm:h-5" />
        <input
          id="search-input-desktop"
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setShowPopup(true)}
          placeholder={placeholderTexts[placeholderIndex]}
          className="w-full flex-1 pl-10 sm:pl-12 md:pl-14 lg:pl-16 pr-3 sm:pr-4 md:pr-5 lg:pr-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg focus:outline-none"
        />
        {errors.destination && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
            <AlertCircle size={12} className="sm:w-4 sm:h-4" />
            <span>{errors.destination}</span>
          </div>
        )}
      </div>

      {/* Search Popup */}
      {showPopup && (
        <div
          id="search-popup"
          className="absolute top-full left-0 right-0 z-50 rounded-xl shadow-2xl mt-2 p-2 xs:p-3 sm:p-4 transform transition-all duration-300 ease-out animate-fadeInUp bg-white"
        >
          {!destinationId && searchValue.trim().length > 2 ? (
            <div>
              <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-3">
                Select Destination
              </h3>
              <ul className="max-h-28 xs:max-h-32 sm:max-h-40 overflow-auto">
                {isSearchingDestinations ? (
                  <li className="p-2 xs:p-3 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-gray-900"></div>
                      <span className="text-xs xs:text-sm">Searching...</span>
                    </div>
                  </li>
                ) : destinations.length > 0 ? (
                  destinations.map((dest) => (
                    <li
                      key={dest.DestinationId}
                      onClick={() => handleDestinationSelect(dest)}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-2"
                    >
                      <MapPin className="text-gray-400 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="text-gray-700 text-xs xs:text-sm sm:text-base">
                        {dest.DestinationName}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="p-2 xs:p-3 text-center text-gray-500 text-xs xs:text-sm">
                    {searchValue.trim().length < 3
                      ? 'Keep typing to see destinations...'
                      : 'No destinations found'}
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <>
              {/* Destination Section */}
              <div className="mb-3">
                <h3 className="text-xs xs:text-sm text-left sm:text-base font-semibold text-gray-800 mb-2">
                  Destination <span className="text-red-500">*</span>
                </h3>
                {destinationId ? (
                  <div className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border rounded-lg bg-gray-50 flex justify-between items-center text-xs xs:text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="truncate">{searchValue}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSearchValue('');
                        setDestinationId('');
                      }}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      &#x2715;
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border-dashed border-2 rounded-lg text-center text-gray-500 cursor-pointer text-xs xs:text-sm"
                    onClick={() =>
                      document
                        .getElementById('search-input-desktop')
                        ?.focus() ||
                      document.getElementById('search-input')?.focus()
                    }
                  >
                    Click to search
                  </div>
                )}
                {errors.destination && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                    <span>{errors.destination}</span>
                  </div>
                )}
              </div>

              {/* More Filters Toggle Button */}
              <div className="mb-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-400 hover:text-red-600 transition-colors text-xs xs:text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>{showFilters ? 'Hide' : 'More'} Filters</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Collapsible Filters Section */}
              {showFilters && (
                <>
                  <div className="mb-3">
                    <h3 className="text-xs xs:text-sm text-left sm:text-base font-semibold text-gray-800 mb-2">
                      Theme
                    </h3>
                    <div className="flex flex-wrap gap-1.5 xs:gap-2">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() =>
                            toggleHandler(t.id, setSelectedThemes)
                          }
                          className={`px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs sm:text-sm ${selectedThemes.includes(t.id) ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-xs xs:text-sm text-left sm:text-base font-semibold text-gray-800 mb-2">
                      Duration
                    </h3>
                    <div className="flex flex-wrap gap-1.5 xs:gap-2">
                      {durations.map((d) => (
                        <button
                          key={d.id}
                          onClick={() =>
                            toggleHandler(
                              d.id,
                              setSelectedDurations
                            )
                          }
                          className={`px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs sm:text-sm ${selectedDurations.includes(d.id) ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-xs xs:text-sm text-left sm:text-base font-semibold text-gray-800 mb-2">
                      Price Range
                    </h3>
                    <div className="flex items-center justify-between mb-1 text-xs sm:text-sm text-gray-600">
                      <span>5K</span>
                      <span>5L</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #dc2626 ${priceRange}%, #e5e7eb ${priceRange}%)`,
                      }}
                    />
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1">
                        <label className="block text-xs text-left text-gray-600 mb-1">
                          Min <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={`₹${minPrice}`}
                          onChange={(e) =>
                            handlePriceInputChange(e.target.value, 'min')
                          }
                          className={`w-full px-2 py-1.5 border rounded-lg text-xs sm:text-sm ${errors.minPrice ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-left text-gray-600 mb-1">
                          Max <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={`₹${maxPrice}`}
                          onChange={(e) =>
                            handlePriceInputChange(e.target.value, 'max')
                          }
                          className={`w-full px-2 py-1.5 border rounded-lg text-xs sm:text-sm ${errors.maxPrice ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </div>
                    </div>
                    {errors.priceRange && (
                      <div className="text-red-500 text-xs mt-2">
                        {errors.priceRange}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                {showFilters && (
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-2 xs:px-3 py-2 border rounded-lg text-xs xs:text-sm font-medium hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className={`${showFilters ? 'flex-1' : 'w-full'} px-2 xs:px-3 py-2 bg-red-600 text-white rounded-lg text-xs xs:text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isSearching && (
                    <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}
