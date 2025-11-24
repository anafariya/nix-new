import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed video background - replaced with blue background
import { Button } from '../ui/button';
import { VisaFaq } from './visa-faq';
import { MapPin } from 'lucide-react';
import axios from 'axios';

interface Country {
  CountryId: number;
  CountryName: string;
}


interface VisaCard {
  VisaId: number;
  CountryName: string;
  ThumbnailImage: string;
  Price: number;
}

interface VisaCategory {
  VisaCategory: string;
  VisaList: VisaCard[];
}

const SearchIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

const VisaLandingPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    mobile: '',
    destinationCountry: '',
    visaType: '',
  });
  const [enquiryErrors, setEnquiryErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    destinationCountry: '',
    visaType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [allDestinations, setAllDestinations] = useState<
    { CountryName: string; VisaId: number }[]
  >([]);
  const [enquiryVisaTypes, setEnquiryVisaTypes] = useState<any[]>([]);

  const navigate = useNavigate();

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchCountries = async (SearchText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.nixtour.com/api/Web/VisaCountrySearchList?SearchText=${SearchText}`
      );
      const data = await response.json();
      if (data && data.Data && data.Data.CountryList) {
        setCountries(data.Data.CountryList);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchCountries = useCallback(
    debounce(fetchCountries, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountrySearch(value);
    setSelectedCountry(null);

    if (value.length > 2) {
      debouncedFetchCountries(value);
    } else {
      setCountries([]);
    }
  };

  const handleEnquiryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEnquiryForm = () => {
    const newErrors = {
      name: '',
      email: '',
      mobile: '',
      destinationCountry: '',
      visaType: '',
    };
    if (!enquiryForm.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(enquiryForm.name)) {
      newErrors.name = 'Name should contain only letters';
    }
    if (!enquiryForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!enquiryForm.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const digits = enquiryForm.mobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
      }
    }
    if (!enquiryForm.destinationCountry) {
      newErrors.destinationCountry = 'Destination country is required';
    }
    if (!enquiryForm.visaType) {
      newErrors.visaType = 'Visa type is required';
    }
    setEnquiryErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleVisaEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnquiryForm()) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    try {
      const countryObj = countries.find(
        (c) => c.CountryName === enquiryForm.destinationCountry
      );
      const visaTypeObj = enquiryVisaTypes.find(
        (v) => v.VisaType === enquiryForm.visaType
      );
      const payload = {
        Name: enquiryForm.name,
        Mobile: enquiryForm.mobile.replace(/\D/g, ''),
        EmailId: enquiryForm.email,
        Holiday_Adult: 0,
        Holiday_Child: 0,
        Holiday_Infant: 0,
        Holiday_PackageName: '',
        Holiday_Destination: '',
        Visa_VisaTypeId: visaTypeObj ? visaTypeObj.VisaTypeId : 0,
        Visa_Destination: countryObj
          ? countryObj.CountryName
          : enquiryForm.destinationCountry,
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
        setEnquiryForm({
          name: '',
          email: '',
          mobile: '',
          destinationCountry: '',
          visaType: '',
        });
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


  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch('https://api.nixtour.com/api/Web/VisaList');
        const data = await res.json();
        if (data && data.Data && data.Data.VisaList) {
          setAllDestinations(data.Data.VisaList);
        }
      } catch (err) {
        setAllDestinations([]);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (enquiryForm.destinationCountry) {
      // Fetch CountryId using the country name
      fetch(
        `https://api.nixtour.com/api/Web/VisaCountrySearchList?SearchText=${encodeURIComponent(enquiryForm.destinationCountry)}`
      )
        .then((res) => res.json())
        .then((countryData) => {
          if (countryData && countryData.Data && countryData.Data.CountryList) {
            const foundCountry = countryData.Data.CountryList.find(
              (c: any) => c.CountryName === enquiryForm.destinationCountry
            );
            if (foundCountry && foundCountry.CountryId) {
              fetch(
                `https://api.nixtour.com/api/Web/VisaTypeListByCountry?CountryId=${foundCountry.CountryId}`
              )
                .then((res) => res.json())
                .then((data) => {
                  if (data && data.Data && data.Data.VisaTypeList) {
                    setEnquiryVisaTypes(data.Data.VisaTypeList);
                  } else {
                    setEnquiryVisaTypes([]);
                  }
                });
            } else {
              setEnquiryVisaTypes([]);
            }
          } else {
            setEnquiryVisaTypes([]);
          }
        });
    } else {
      setEnquiryVisaTypes([]);
    }
  }, [enquiryForm.destinationCountry]);

  const handleSearch = async () => {
    if (selectedCountry) {
      navigate(
        `/visa/${selectedCountry.CountryName.replace(/\s+/g, '-').toLowerCase()}`
      );
    }
  };

  return (
    <>
      {/* Blue header */}
      <div
      className="bg-[#2073C7] flex flex-col items-center justify-center w-full py-12 sm:py-16 md:py-20 lg:py-24  text-center relative"  
      >
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-2 md:mb-4 text-center">
          Book Your{" "}
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
            Visa{" "}
            <MapPin className="size-7 xs:size-8 sm:size-8 md:size-10 lg:size-12 ml-0.5 sm:ml-1 stroke-1 stroke-white fill-nix-prime hover:fill-nix-prime-hover transition duration-300 ease-in-out" />
          </span>{" "}
          With Nixtour
        </h1>
        <p className="text-base xs:text-lg sm:text-lg md:text-xl text-white  font-semibold text-center">
          From Visa Paperwork to Plane Tickers - We've Got You!
        </p>
      </div>
      {/* Visa Search UI */}
      <div
        className="flex justify-center"
        style={{
          marginTop: "-40px",
          marginBottom: "40px",
          zIndex: 10,
          position: "relative",
        }}
      >
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-full shadow-lg flex flex-col sm:flex-row items-center w-full text-black">
            {/* Mobile Search Bar */}
            <div className="block sm:hidden w-full">
              <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3 w-full max-w-md mx-auto">
                <div className="relative">
                  <input
                    id="country-search-mobile"
                    type="text"
                    placeholder="Search Country"
                    value={countrySearch}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 outline-none px-4 py-3 rounded-t-lg border border-gray-200 focus:border-nix-prime transition"
                  />
                  {countrySearch.length > 2 && !selectedCountry && (
                    <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                      {isLoading ? (
                        <li className="p-2 text-center text-gray-500">
                          Loading...
                        </li>
                      ) : countries.length > 0 ? (
                        countries.map((country) => (
                          <li
                            key={country.CountryId}
                            onClick={() => {
                              setSelectedCountry(country);
                              setCountrySearch(country.CountryName);
                            }}
                            className="p-2 cursor-pointer hover:bg-nix-prime/10 active:bg-nix-prime/20 text-gray-800 text-base border-b last:border-b-0 border-gray-100"
                          >
                            {country.CountryName}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-center text-gray-500">
                          No results found
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!selectedCountry || isSearching}
                  className="w-full bg-nix-prime text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
            {/* Desktop Search Bar */}
            <div className="hidden sm:flex w-full">
              <div className="flex-1 w-full">
                <input
                  id="country-search-desktop"
                  type="text"
                  placeholder="Search Country"
                  value={countrySearch}
                  onChange={handleInputChange}
                  className="w-full bg-transparent outline-none px-6 py-4"
                />
                {countrySearch.length > 2 && !selectedCountry && (
                  <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <li className="p-2 text-center text-gray-500">
                        Loading...
                      </li>
                    ) : countries.length > 0 ? (
                      countries.map((country) => (
                        <li
                          key={country.CountryId}
                          onClick={() => {
                            setSelectedCountry(country);
                            setCountrySearch(country.CountryName);
                          }}
                          className="p-2 cursor-pointer hover:bg-nix-prime/10 active:bg-nix-prime/20 text-gray-800 text-base border-b last:border-b-0 border-gray-100"
                        >
                          {country.CountryName}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-center text-gray-500">
                        No results found
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={!selectedCountry || isSearching}
                className="px-6 py-4 flex items-center justify-center bg-nix-prime text-white rounded-r-full"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                ) : (
                  <SearchIcon className="h-6 w-6 text-gray-600" />
                )}
                <span className="ml-2">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Section */}
      <div className="pt-12 pb-8 px-4 sm:px-8 md:px-12 lg:px-20 bg-white text-nix-txt">
        <PopularDestinationVisa />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black">
              Nixtour Visa Services: Your Gateway to Seamless Travel
            </h2>
            <p className="mb-6 text-sm sm:text-base">
              Planning an international trip? At Nixtour, we make visa
              processing easy, fast, and stress-free. Whether you're traveling
              for leisure, business, education, or work, our expert team guides
              you through every step of the visa application process.
            </p>

            <h3 className="text-xl sm:text-2xl md:text-3xl tracking-normal font-bold mb-3">
              Our Services Include:
            </h3>
            <ul className="list-disc list-outside mb-6 ml-4 text-sm sm:text-base lg:text-lg space-y-2">
              <li>
                <strong>Tourist Visas</strong>
                <p>
                  Explore new destinations without the hassle. We assist with
                  tourist visas for all major countries.
                </p>
              </li>
              <li>
                <strong>Business Visas</strong>
                <p>
                  Travel for work with confidence. Get help preparing documents
                  and scheduling appointments.
                </p>
              </li>
              <li>
                <strong>Student Visas</strong>
                <p>
                  Pursuing education abroad? We offer full support for your
                  student visa applications.
                </p>
              </li>
              <li>
                <strong>Work Visas</strong>
                <p>
                  Start your international career journey with expert advice on
                  work visa procedures.
                </p>
              </li>
            </ul>

            <h3 className="text-xl sm:text-2xl md:text-3xl tracking-normal font-bold mb-3">
              What We Offer:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Personalized consultation based on your travel needs</li>
              <li>Complete assistance with documentation</li>
              <li>Quick updates on visa application status</li>
              <li>Expert advice on interview preparation</li>
              <li>Guidance on travel insurance and other essentials</li>
            </ul>

            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl tracking-normal font-bold mb-3">
                Why Choose Nixtour?
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                <li>Experienced and trusted visa experts</li>
                <li>Transparent process with no hidden charges</li>
                <li>High approval rate across multiple visa categories</li>
                <li>End-to-end support — from application to approval</li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl tracking-normal font-bold mb-3">
                Simplify Your Journey with Nixtour
              </h3>
              <p className="!font-medium text-sm sm:text-base">
                Stay ahead of your travel plans. Trust Nixtour to handle your
                visa formalities while you focus on planning your perfect trip.
              </p>
              <p className="mt-2 text-sm sm:text-base">
                Get in touch with us today and make your dream journey a
                reality!
              </p>
            </div>
          </div>
          <div className="p-4 sm:p-6 !rounded-lg">
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                Enquiry Form
              </h3>
              <form onSubmit={handleVisaEnquirySubmit}>
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
                    value={enquiryForm.name}
                    onChange={handleEnquiryInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${enquiryErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {enquiryErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {enquiryErrors.name}
                    </p>
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
                    value={enquiryForm.email}
                    onChange={handleEnquiryInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${enquiryErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {enquiryErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {enquiryErrors.email}
                    </p>
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
                    value={enquiryForm.mobile}
                    onChange={handleEnquiryInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${enquiryErrors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {enquiryErrors.mobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {enquiryErrors.mobile}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Destination Country
                  </label>
                  <select
                    id="destination"
                    name="destinationCountry"
                    value={enquiryForm.destinationCountry}
                    onChange={handleEnquiryInputChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2  text-base ${enquiryErrors.destinationCountry ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-[6px]`}
                  >
                    <option value="">Select Country</option>
                    {allDestinations.map((country) => (
                      <option key={country.VisaId} value={country.CountryName}>
                        {country.CountryName}
                      </option>
                    ))}
                  </select>
                  {enquiryErrors.destinationCountry && (
                    <p className="text-red-500 text-xs mt-1">
                      {enquiryErrors.destinationCountry}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="visa-type-form"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Visa Type
                  </label>
                  <select
                    id="visa-type-form"
                    name="visaType"
                    value={enquiryForm.visaType}
                    onChange={handleEnquiryInputChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${enquiryErrors.visaType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-[6px]`}
                  >
                    <option value="">Select Visa Type</option>
                    {enquiryVisaTypes.map((type) => (
                      <option key={type.VisaTypeId} value={type.VisaType}>
                        {type.VisaType}
                      </option>
                    ))}
                  </select>
                  {enquiryErrors.visaType && (
                    <p className="text-red-500 text-xs mt-1">
                      {enquiryErrors.visaType}
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
        <div className="mt-8 sm:mt-12">
          <VisaFaq />
        </div>
      </div>
    </>
  );
};

const thumbnailUrlFormatter = (thumbnailUrl: string) => {
  if (!thumbnailUrl) return '';
  if (thumbnailUrl.startsWith('img')) {
    return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split('/')[1]}`;
  }
  return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split('\\')[2] || thumbnailUrl}`;
};

const PopularDestinationVisa = () => {
  const [visaCategories, setVisaCategories] = useState<VisaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisaCategories = async () => {
      try {
        const url = 'https://api.nixtour.com/api/Web/VisaListWithCategory';
        console.log('🔍 Fetching visa categories from:', url);
        
        const res = await fetch(url);
        const data = await res.json();
        
        console.log('📊 Visa List API Response:', data);
        console.log('📋 Full response structure:', JSON.stringify(data, null, 2));
        
        if (data && data.Data && data.Data.VisaCategoryList) {
          console.log('✅ Visa categories found:', data.Data.VisaCategoryList);
          console.log('📂 Number of categories:', data.Data.VisaCategoryList.length);
          data.Data.VisaCategoryList.forEach((category: any, index: number) => {
            console.log(`📁 Category ${index + 1}:`, category.VisaCategory);
            console.log(`   📄 Number of visas:`, category.VisaList?.length || 0);
          });
          setVisaCategories(data.Data.VisaCategoryList);
        } else {
          console.log('❌ No visa categories found in response');
          console.log('🔍 Available data keys:', data?.Data ? Object.keys(data.Data) : 'No Data object');
          setVisaCategories([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('🚨 Error fetching visa categories:', err);
        setError('Failed to load visa list.');
        setLoading(false);
      }
    };
    fetchVisaCategories();
  }, []);

  return (
    <section className="mb-12 sm:mb-16 md:mb-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold mb-2">
        Popular Destination Visa
      </h2>
      <p className="mb-4 text-sm sm:text-base lg:text-lg text-gray-700">
        Explore the world's top destinations with ease through Nixtour's trusted
        visa services. From Dubai to Europe, we simplify your visa process for a
        hassle-free journey.
      </p>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : (
        <div className="space-y-8">
          {visaCategories.map((category) => (
            <div key={category.VisaCategory}>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-black">
                {category.VisaCategory}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {category.VisaList.map((visa) => (
                  <div
                    key={visa.VisaId}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() =>
                      navigate(`/visa/${visa.CountryName.replace(/\s+/g, '-').toLowerCase()}`)
                    }
                  >
                    <img
                      src={thumbnailUrlFormatter(visa.ThumbnailImage)}
                      alt={visa.CountryName}
                      className="w-full h-36 sm:h-40 md:h-48 object-cover"
                    />
                    <div className="p-3 sm:p-4">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {visa.CountryName}
                      </h3>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        Visa Price: ₹{visa.Price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default VisaLandingPage;
