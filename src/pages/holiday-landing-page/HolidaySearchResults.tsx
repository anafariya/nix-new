import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../footer';
import FAQ from '../../components/holiday-landing/FAQ';
import { Button } from '../../components/ui/button';
import HolidayCard from '../../components/HolidayCard';
import WhyChooseNixtour from '../../components/holiday-landing/WhyChooseNixtour';
import HolidaySearchBar from '../../components/holiday-landing/HolidaySearchBar';
import axios from 'axios';
import { LucideLoader } from 'lucide-react';

// --- Interfaces ---
interface Package {
  PackageId: number;
  PackageName: string;
  Duration: string;
  MiniInclusions: string;
  StartingPrice: number;
  ThumbnailImage: string;
}

// --- Helper Function ---
const bannerUrlFormatter = (bannerImage: string | null) => {
  if (!bannerImage) return '';
  if (bannerImage.startsWith('img')) {
    return `https://api.nixtour.com/api/Image/GetImage/${bannerImage.split('/')[1]}`;
  }
  return `https://api.nixtour.com/api/Image/GetImage/${bannerImage.split('\\')[2] || bannerImage}`;
};

const getTruncatedContent = (html: string, wordLimit: number) => {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= wordLimit) return html;
  let wordCount = 0,
    i = 0;
  for (; i < html.length && wordCount < wordLimit; i++) {
    if (/\s/.test(html[i])) {
      if (i === 0 || !/\s/.test(html[i - 1])) wordCount++;
    }
  }
  let truncated = html.slice(0, i);
  truncated += '...';
  return truncated;
};

// --- URL Parsing Helpers (from HolidaySearchBar) ---
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
const getDestinationIdFromName = async (destinationName: string) => {
  try {
    const response = await axios.get(
      `https://api.nixtour.com/api/TextSearch/Destinations?searchText=${destinationName}`
    );
    if (response.data?.Data?.length > 0) {
      const exactMatch = response.data.Data.find(
        (dest: any) =>
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
const fetchHolidayResults = async (params: {
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

export default function HolidaySearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cityName } = useParams();
  const results = location.state?.results;
  const [loading, setLoading] = useState(
    !results && (location.pathname.includes('/holiday/search/') || !!cityName)
  );
  const [fetchedResults, setFetchedResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    destination: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    destination: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showFullContent, setShowFullContent] = useState(false);
  const displayResults = results || fetchedResults;

  const truncatedContent = useMemo(() => {
    if (!displayResults?.Content) return '';
    return getTruncatedContent(displayResults.Content, 300);
  }, [displayResults?.Content]);

  const metaTitle = displayResults?.Title || 'Holiday Packages | Nixtour';
  const metaDescription =
    displayResults?.Description ||
    'Discover amazing holiday packages with Nixtour. Book your perfect holiday with best prices and expert guidance.';

  useEffect(() => {
    // Extract city from /holidays/city-tour-packages URL
    const pathMatch = location.pathname.match(/\/holidays\/(.+)/);
    const cityFromUrl = pathMatch ? pathMatch[1] : null;

    // Handle both old search URLs and new city-specific URLs
    if (
      !results &&
      (location.pathname.includes('/holiday/search/') ||
        cityName ||
        cityFromUrl)
    ) {
      let urlParams: any;

      if (location.pathname.includes('/holiday/search/')) {
        // Old complex search URL
        urlParams = parseUrlToSearchParams(location.pathname);
        if (!urlParams) {
          setLoading(false);
          return;
        }
      } else if (cityName || cityFromUrl) {
        // New simple city URL like /holidays/mumbai-tour-packages
        const cityToUse = cityName || cityFromUrl;
        const extractedCityName = cityToUse
          ?.replace(/-tour-packages$/, '')
          .replace(/-/g, ' ');

        urlParams = {
          destination: extractedCityName,
          themes: [],
          durations: [],
          minPrice: '0',
          maxPrice: '500000',
        };
      }

      setLoading(true);
      (async () => {
        try {
          const destId = await getDestinationIdFromName(urlParams.destination);
          if (!destId) {
            setFetchedResults(null);
            setLoading(false);
            return;
          }

          const apiResults = await fetchHolidayResults({
            DestinationId: destId,
            MinPrice: urlParams.minPrice,
            MaxPrice: urlParams.maxPrice,
            ThemeIdStr: urlParams.themes.join(','),
            DurationIdStr: urlParams.durations.join(','),
          });

          setFetchedResults(apiResults);
          setLoading(false);
        } catch (e) {
          console.error('❌ ERROR FETCHING PACKAGES:', e);
          setFetchedResults(null);
          setLoading(false);
        }
      })();
    }
  }, [location.pathname, results]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = { name: '', email: '', mobile: '', destination: '' };
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should contain only letters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const digits = formData.mobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
      }
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Submit handler
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    try {
      const payload = {
        Name: formData.name,
        Mobile: formData.mobile.replace(/\D/g, ''),
        EmailId: formData.email,
        Holiday_Adult: 0,
        Holiday_Child: 0,
        Holiday_Infant: 0,
        Holiday_PackageName: '',
        Holiday_Destination: formData.destination,
        Visa_VisaTypeId: 0,
        Visa_Destination: '',
        GroupBooking_CompanyName: '',
        GroupBooking_FromLocation: '',
        GroupBooking_ToLocation: '',
        GroupBooking_Airline: '',
        GroupBooking_NoofPassenger: 0,
        GroupBooking_GroupTypeId: 0,
        PageUrl: window.location.href,
        SessionId: '',
        CreateId: 0,
        EnquiryFor: '',
        VisaType: '',
        GroupType: '',
      };
      const response = await axios.post(
        'https://api.nixtour.com/api/Enquiry/submit',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data) {
        setSubmitStatus({
          type: 'success',
          message: 'Your enquiry has been submitted successfully!',
        });
        setFormData({ name: '', email: '', mobile: '', destination: '' });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 2000);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Spinner View
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f8fa]">
        <Navbar />
        <div className="flex-1 flex flex-col my-24 items-center justify-center w-full">
          <div className="rounded-2xl px-8 py-10 flex flex-col items-center max-w-md w-full">
            <div className="w-full min-h-[400px] flex items-center justify-center">
              <div className="text-center text-nix-prime flex flex-col items-center">
                <p className="text-xl font-semibold mb-2">Loading...</p>
                <p className="text-gray-600 text-center text-base">
                  Fetching the best holiday packages for you.
                </p>
                <LucideLoader className="animate-spin size-10" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No Results View
  if (!displayResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f8fa]">
        <Navbar />
        <div className="flex-1 flex flex-col my-24 items-center justify-center w-full">
          <div className="rounded-2xl px-8 py-10 flex flex-col items-center max-w-md w-full">
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#BC1110"
              className="mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              />
            </svg>
            <h1 className="text-3xl font-extrabold text-[#BC1110] mb-2 text-center">
              No Data Found
            </h1>
            <p className="text-gray-600 mb-6 text-center text-base">
              We couldn't find any results for your search.
              <br />
              Please try different filters or destinations.
            </p>
            <Button
              onClick={() => navigate('/holiday')}
              className="bg-[#BC1110] hover:bg-[#a30f0d] text-white font-semibold px-6 py-2 rounded-[8px]"
            >
              Back to Holiday Search
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const packages: Package[] = displayResults.Packages || [];
  const bannerImage = displayResults.BannerImage;

  return (
    <div
      key={location.pathname}
      className="min-h-screen bg-gray-50 w-full flex flex-col"
    >
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Navbar />
      <div className="relative min-h-[60svh] w-full flex items-start pt-16 justify-center">
        {bannerImage ? (
          <>
            <img
              src={bannerUrlFormatter(bannerImage)}
              alt="Holiday Banner"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-700 z-0" />
        )}
        <HolidaySearchBar
          onSearchStart={() => setLoading(true)}
          onSearchEnd={() => setLoading(false)}
        />
      </div>
      <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-20 mx-auto w-full">
        <h1 className="py-8 text-3xl font-bold text-[#BC1110]">
          {displayResults.Title}
        </h1>
        <div className="flex flex-col lg:flex-row items-start gap-4">
          <div className="w-full lg:max-w-[70%]">
            {packages.length === 0 ? (
              <div className="text-center text-gray-500">
                No packages found for your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {packages.map((pkg) => (
                  <HolidayCard key={pkg.PackageId} pkg={{ Package: pkg }} />
                ))}
              </div>
            )}
            {displayResults.Content && (
              <div className="w-full mt-8 rich-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: showFullContent
                      ? displayResults.Content
                      : truncatedContent,
                  }}
                />
                {displayResults.Content.replace(/<[^>]+>/g, ' ')
                  .split(/\s+/)
                  .filter(Boolean).length > 300 && (
                  <button
                    className="mt-2 text-[#BC1110] underline text-sm font-semibold focus:outline-none"
                    onClick={() => setShowFullContent((prev) => !prev)}
                  >
                    {showFullContent ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}
            <WhyChooseNixtour />
          </div>
          <div className="w-full lg:max-w-[30%] lg:flex-shrink-0 !rounded-lg">
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                Enquiry Form
              </h3>
              <form onSubmit={handleEnquirySubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Id
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile No
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.destination ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.destination}
                    </p>
                  )}
                </div>
                {submitStatus.type && (
                  <div
                    className={`p-2 rounded mb-2 text-center ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {submitStatus.message}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[brown] hover:bg-[brown] rounded-[6px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto mt-12">
          <FAQ
            landing={false}
            faqs={
              Array.isArray(displayResults.Faqs)
                ? displayResults.Faqs.map((f: any) => ({
                    question: f.Question,
                    answer: f.Answer,
                  }))
                : undefined
            }
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
