import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Calendar, X, User, Phone, Mail, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Helmet } from 'react-helmet';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import NotFound from '../not-found/not-found';
import { generatePackageNameCandidates, getMiniInclusionIcon } from '../../../lib/utils';

interface PackageDetails {
  Title: string;
  Description: string;
  Keywords: string;
  BannerImage: string;
  ThumbnailImage: string;
  PackageName: string;
  PackageDescription: string;
  Duration: string;
  StartingPrice: number;
  Categories: string;
  Cities: string;
  Countries: string;
  MiniInclusions: string;
  Domestic: string;
  International: string;
  IndividualTour: string;
  GroupTour: string;
  VisaStatusId: string;
  Inclusions: string;
  Exclusions: string;
  SpecialAttractions: string;
  ItineraryList: Array<{
    PackageDay: number;
    Title: string;
    Description: string;
  }>;
  FlightList: Array<{
    RouteName: string;
    DepartureTime: string;
    ArrivalTime: string;
    TotDuration: string;
    FlightName: string;
  }>;
  HotelList: Array<{
    CityName: string;
    HotelName: string;
  }>;
}

export default function PackageDetails() {
  const { packageName: routePackageName, filterSlug } = useParams();
  const location = useLocation();
  
  // Get PackageName from sessionStorage mapping or extract from URL path
  const getPackageNameFromPath = () => {
    // First check if we have the actual PackageName stored in sessionStorage
    if (routePackageName) {
      const storedPackageName = sessionStorage.getItem(`pkg_${routePackageName}`);
      if (storedPackageName) {
        return storedPackageName;
      }
    }
    
    // Fallback to extracting from URL path
    if (routePackageName) {
      return routePackageName;
    }
    
    const pathname = location.pathname;
    const pathSegments = pathname.split('/');
    if (pathSegments.length >= 3 && pathSegments[1] === 'holiday') {
      const extractedName = pathSegments[2];
      // Check sessionStorage for this slug
      const storedPackageName = sessionStorage.getItem(`pkg_${extractedName}`);
      if (storedPackageName) {
        return storedPackageName;
      }
      return extractedName;
    }
    return null;
  };
  
  const packageName = getPackageNameFromPath();
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(
    null
  );
  const [notFound, setNotFound] = useState(false);
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [metaKeywords, setMetaKeywords] = useState<string>('');
  const [bannerImage, setBannerImage] = useState<string>('');
  const [holidayEnquiryModalOpen, setHolidayEnquiryModalOpen] = useState(false);
  const miniInclusions = packageDetails?.MiniInclusions.split(', ') ?? [];
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [hasShownAutoPopup, setHasShownAutoPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'mobile') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');

      // Format the number with +91 prefix if it's not already there
      let formattedValue = digitsOnly;
      if (digitsOnly.length > 0) {
        if (!digitsOnly.startsWith('91')) {
          formattedValue = `+91 ${digitsOnly}`;
        } else {
          formattedValue = `+${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2)}`;
        }
      }

      // Only update if the length is valid (max 10 digits after +91)
      if (digitsOnly.length <= 12) {
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      mobile: '',
      email: '',
    };

    // Name validation - letters only
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should contain only letters';
    }

    // Mobile validation - Indian format
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const mobileDigits = formData.mobile.replace(/\D/g, '');
      if (mobileDigits.length !== 12 || !mobileDigits.startsWith('91')) {
        newErrors.mobile = 'Please enter a valid Indian mobile number';
      }
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: '' });

      try {
        const payload = {
          Name: formData.name,
          Mobile: formData.mobile.replace(/\D/g, ''),
          EmailId: formData.email,
          Holiday_Adult: adults,
          Holiday_Child: children,
          Holiday_Infant: infants,
          Holiday_PackageName: packageDetails?.PackageName || '',
          Holiday_Destination: packageDetails?.Countries || '',
          PageUrl: window.location.href,
          SessionId: '',
          CreateId: 0,
          EnquiryFor: '',
          VisaType: '',
          GroupType: '',
          Visa_VisaTypeId: 0,
          Visa_Destination: '',
          GroupBooking_CompanyName: '',
          GroupBooking_FromLocation: '',
          GroupBooking_ToLocation: '',
          GroupBooking_Airline: '',
          GroupBooking_NoofPassenger: 0,
          GroupBooking_GroupTypeId: 0,
        };

        const response = await axios.post(
          'https://api.nixtour.com/api/Enquiry/submit',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data) {
          setSubmitStatus({
            type: 'success',
            message: 'Your enquiry has been submitted successfully!',
          });
          // Reset form
          setFormData({ name: '', mobile: '', email: '' });
          setAdults(2);
          setChildren(0);
          setInfants(0);
          // Close modal after 2 seconds
          setTimeout(() => {
            setHolidayEnquiryModalOpen(false);
            setSubmitStatus({ type: null, message: '' });
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting enquiry:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Failed to submit enquiry. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if enquiry modal should be opened from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enquiry') === 'true') {
      setHolidayEnquiryModalOpen(true);
      setHasShownAutoPopup(true); // Prevent auto-popup since modal is opened via URL
    }

    const fetchPackageDetails = async () => {
      try {
        if (!packageName) {
          setNotFound(true);
          return;
        }
        
        // Generate possible PackageName candidates from the URL slug (same as before)
        const candidates = generatePackageNameCandidates(packageName);
        
        for (const candidate of candidates) {
          try {
            const response = await axios.get('https://api.nixtour.com/api/Web/HolidayPackageByName', {
              params: { PackageName: candidate }
            });
            
            if (response?.data?.Data && response.data.Data.PackageName) {
              const packageData = response.data.Data;
              setMetaTitle(packageData.Title || 'Default Package Title');
              setMetaDescription(
                packageData.Description || 'Default description for the Package.'
              );
              setMetaKeywords(packageData.Keywords);
              setPackageDetails(packageData);
              if (packageData.BannerImage) {
                fetchBannerImage(packageData.BannerImage);
              }
              setNotFound(false);
              return;
            }
          } catch (candidateError) {
            // Continue to next candidate
            continue;
          }
        }
        
        // If no candidate worked, show 404
        setNotFound(true);
      } catch (error) {
        setNotFound(true);
        console.error('Error fetching package details:', error);
      }
    };

    const fetchBannerImage = async (imageName: string) => {
      try {
        const imageUrl = `https://api.nixtour.com/api/Image/GetImage/${imageName}`;
        const response = await axios.get(imageUrl, { responseType: 'blob' });
        setBannerImage(URL.createObjectURL(response.data));
      } catch (error) {
        console.error('Error fetching banner image:', error);
      }
    };

    if (packageName) {
      fetchPackageDetails();
    }
    // Auto-popup enquiry form after 20 seconds
    const autoPopupTimer = setTimeout(() => {
      if (!hasShownAutoPopup && !holidayEnquiryModalOpen) {
        console.log('⏰ Auto-opening Holiday Enquiry popup after 20 seconds');
        setHolidayEnquiryModalOpen(true);
        setHasShownAutoPopup(true);
      }
    }, 20000); // 20 seconds

    // Cleanup timer on component unmount
    return () => {
      clearTimeout(autoPopupTimer);
    };
  }, [location.pathname, filterSlug]);

  if (notFound) {
    return <NotFound />;
  }
  if (!packageDetails) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[50vh] bg-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-4 border-[#BC1110] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#BC1110] text-lg font-semibold">Loading Package Details...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }


  return (
    <div className="bg-[#ffffff] shadow-lg rounded-md mx-auto border">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
      </Helmet>
      <Navbar />
      <div className="p-2 sm:p-3 md:p-5">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-justify">
          {packageDetails.PackageName}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-4 w-full">
              <div className="aspect-[850/400] w-full relative">
                <img
                  src={bannerImage}
                  alt={packageDetails.Title}
                  className="object-cover w-full h-full absolute inset-0 rounded-2xl"
                />
              </div>
            </div>
            <Tabs defaultValue="overview" className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="bg-transparent border-b w-full justify-start gap-2 sm:gap-4 rounded-none h-auto min-h-10 flex-wrap">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-[#BC1110] px-3 sm:px-5 py-2 data-[state=active]:text-white font-semibold rounded-[8px] data-[state=active]:border-b-0 text-xs sm:text-sm"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="inclusions"
                    className="data-[state=active]:bg-[#BC1110] px-3 sm:px-5 py-2 data-[state=active]:text-white font-semibold rounded-[8px] data-[state=active]:border-b-0 text-xs sm:text-sm"
                  >
                    Inclusions/Exclusions
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancellation"
                    className="data-[state=active]:bg-[#BC1110] px-3 sm:px-5 py-2 data-[state=active]:text-white font-semibold rounded-[8px] data-[state=active]:border-b-0 text-xs sm:text-sm"
                  >
                    Cancellation
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="pt-4">
                <p
                  dangerouslySetInnerHTML={{
                    __html: packageDetails.PackageDescription,
                  }}
                  className="text-xs md:text-sm text-gray-700 mb-4 text-justify"
                />

                <h2 className="text-lg font-bold mb-2 text-justify">Highlights</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: packageDetails.SpecialAttractions,
                  }}
                  className="text-xs md:text-sm text-gray-700 text-justify"
                />

                <h2 className="text-lg font-bold mt-6 mb-2 text-justify">Itinerary</h2>
                <div className="space-y-4">
                  {packageDetails.ItineraryList.length > 0 &&
                    packageDetails.ItineraryList.map((itr, index) => (
                      <div
                        key={index}
                        className="border rounded-md overflow-hidden"
                      >
                        <div className="px-3 sm:px-4 py-2">
                          <h3 className="border-b border-[#BC1110] text-sm sm:text-lg text-justify">
                            <span className="bg-[#BC1110] text-white rounded-[6px] px-3 sm:px-4 py-1.5 mr-2">
                              Day {itr.PackageDay}
                            </span>{' '}
                            {itr.Title}
                          </h3>
                        </div>
                        <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
                          <p className="text-justify">{itr.Description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="inclusions">
                <h2 className="text-lg font-bold mt-4 mb-2 text-justify">Inclusions</h2>
                <div className="prose prose-custom text-xs md:text-sm text-gray-700 max-w-none text-justify">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: packageDetails.Inclusions,
                    }}
                  />
                </div>
                <h2 className="text-lg font-bold mt-4 mb-2 text-justify">Exclusions</h2>
                <div className="prose prose-custom text-xs md:text-sm text-gray-700 max-w-none text-justify">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: packageDetails.Exclusions,
                    }}
                  />
                </div>
                {packageDetails.FlightList &&
                  packageDetails.FlightList.length !== 0 && (
                    <h2 className="text-lg font-bold mt-6 mb-2 text-justify">Flights</h2>
                  )}
                <div className="space-y-6">
                  {packageDetails.FlightList &&
                    packageDetails.FlightList.map((flight, index: number) => (
                      <div key={index}>
                        <h3 className="mb-4 text-base sm:text-lg font-semibold text-[#BC1110] flex items-center gap-2 before:content-[''] before:w-1 before:h-4 before:bg-[#8B0000] before:rounded">
                          {flight.RouteName}
                        </h3>
                        <div className="overflow-x-auto">
                          <Table className="w-full min-w-[500px] table-fixed rounded-[8px] shadow-sm">
                            <TableHeader className="bg-gray-200">
                              <TableRow>
                                <TableHead className="font-medium text-[#1e293b] whitespace-nowrap w-1/5 text-xs sm:text-sm">
                                  Route
                                </TableHead>
                                <TableHead className="font-medium text-[#1e293b] whitespace-nowrap w-1/5 text-xs sm:text-sm">
                                  Departure
                                </TableHead>
                                <TableHead className="font-medium text-[#1e293b] whitespace-nowrap w-1/5 text-xs sm:text-sm">
                                  Arrival
                                </TableHead>
                                <TableHead className="font-medium text-[#1e293b] whitespace-nowrap w-1/5 text-xs sm:text-sm">
                                  Duration
                                </TableHead>
                                <TableHead className="font-medium text-[#1e293b] whitespace-nowrap w-1/5 text-xs sm:text-sm">
                                  Name
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-[#e5e7eb] transition-colors hover:bg-[#f8fafc]">
                                <TableCell className="text-[#334155] whitespace-break-spaces text-xs sm:text-sm">
                                  {flight?.RouteName}
                                </TableCell>
                                <TableCell className="text-[#334155] whitespace-nowrap text-xs sm:text-sm">
                                  {flight?.DepartureTime}
                                </TableCell>
                                <TableCell className="text-[#334155] whitespace-nowrap text-xs sm:text-sm">
                                  {flight?.ArrivalTime}
                                </TableCell>
                                <TableCell className="text-[#334155] whitespace-nowrap text-xs sm:text-sm">
                                  {flight?.TotDuration}
                                </TableCell>
                                <TableCell className="text-[#334155] whitespace-nowrap text-xs sm:text-sm">
                                  {flight?.FlightName || 'Unknown'}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                </div>

                {packageDetails.HotelList &&
                  packageDetails.HotelList.length !== 0 && (
                    <h2 className="text-lg font-bold mt-6 mb-2 text-justify">Hotel</h2>
                  )}
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-[300px] rounded-[8px] shadow-sm border border-gray-300">
                    <TableHeader className="bg-gray-300">
                      <TableRow className="border-b border-gray-400">
                        <TableHead className="font-medium text-[#1e293b] whitespace-nowrap border-r border-gray-400 text-xs sm:text-sm">
                          City
                        </TableHead>
                        <TableHead className="font-medium text-[#1e293b] whitespace-nowrap text-xs sm:text-sm">
                          Hotel Name
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packageDetails.HotelList.map((hotel, index: number) => (
                        <TableRow
                          key={index}
                          className="transition-colors hover:bg-[#f8fafc] border-b border-gray-300"
                        >
                          <TableCell className="font-medium text-[#1e293b] border-r border-gray-300 text-xs sm:text-sm">
                            {hotel.CityName}
                          </TableCell>
                          <TableCell className="font-medium text-[#1e293b] text-xs sm:text-sm">
                            {hotel.HotelName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="cancellation">
                <div className="mx-auto p-3 sm:p-6 text-xs md:text-sm text-gray-700 bg-white rounded-md shadow-sm">
                  <h2 className="text-lg font-bold mb-2 text-justify">
                    Cancellation Policy
                  </h2>
                  <p className="mb-4 leading-relaxed text-justify">
                    Irrespective of above mentioned cancellations slabs - in
                    case of cancellation of tour / travel services after the
                    booking is made with us - a minimum 20% service charges
                    would be applicable. In case you cancel the trip after
                    commencement refund would be restricted to a limited amount
                    that too would depend on the amount that we would be able to
                    recover from the hoteliers we patronize. For unused hotel
                    accommodation, chartered transportation and missed meals
                    etc. we do not bear any responsibility to refund.
                  </p>

                  <p className="mb-4 leading-relaxed text-justify">
                    Please note that if booking for following period is/are
                    cancelled, due to whatsoever reason, no refund would be made
                    for said cancellation.
                  </p>

                  <p className="mb-2 text-justify">
                    High Peak Season bookings (from 20th Dec to 15th Jan).
                  </p>

                  <p className="mb-2 text-justify">
                    Festival Period Bookings (Festivals like -Diwali, Dussehra,
                    Holi, Pushkar fair etc.).
                  </p>

                  <p className="mb-6 text-justify">Long Weekends Bookings.</p>

                  <div className="mb-6">
                    <div className="bg-[#BC1110] text-white py-2 px-4 font-medium text-xs sm:text-sm text-justify">
                      Cancellation charges as per dates.
                    </div>

                    <div className="border border-gray-300 text-xs sm:text-sm overflow-x-auto">
                      <div className="min-w-[500px]">
                        <div className="grid grid-cols-3 bg-gray-300 text-gray-800 font-medium">
                          <div className="p-2 sm:p-3 font-bold border-r border-gray-400">
                            No of days prior to departure
                          </div>
                          <div className="p-2 sm:p-3 font-bold border-r border-gray-400">
                            Charges
                          </div>
                          <div className="p-2 sm:p-3 font-bold">Applied On</div>
                        </div>

                        <div className="grid grid-cols-3 bg-white border-t border-gray-300">
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            65 To 60 Days
                          </div>
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            25 %
                          </div>
                          <div className="p-2 sm:p-3">
                            (Starting price per person)
                          </div>
                        </div>

                        <div className="grid grid-cols-3 bg-gray-100 border-t border-gray-300">
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            59 To 30 Days
                          </div>
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            30%
                          </div>
                          <div className="p-2 sm:p-3">
                            (Starting price per person)
                          </div>
                        </div>

                        <div className="grid grid-cols-3 bg-white border-t border-gray-300">
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            29 To 15 Days
                          </div>
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            40%
                          </div>
                          <div className="p-2 sm:p-3">
                            (Starting price per person)
                          </div>
                        </div>

                        <div className="grid grid-cols-3 bg-gray-100 border-t border-gray-300">
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            14 To 8 Days
                          </div>
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            50%
                          </div>
                          <div className="p-2 sm:p-3">
                            (Starting price per person)
                          </div>
                        </div>

                        <div className="grid grid-cols-3 bg-white border-t border-gray-300">
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            7 To 1 Days
                          </div>
                          <div className="p-2 sm:p-3 border-r border-gray-300">
                            100%
                          </div>
                          <div className="p-2 sm:p-3">
                            (Starting price per person)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1 shadow-lg rounded-xl p-4 sm:p-6 bg-white h-auto self-start">
            <div className="bg-[#BC1110] text-white p-4 rounded-xl mb-4">
              <p className="text-xl sm:text-2xl font-thin text-justify">
                INR{' '}
                {packageDetails.StartingPrice.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-justify">(Starting price per person)</p>
            </div>

            <div className="flex justify-start items-center gap-1.5 mb-2 flex-wrap">
              {miniInclusions.map((mi, idx) => {
                const Icon = getMiniInclusionIcon(mi);
                return Icon ? (
                  <div
                    key={idx}
                    className={`flex flex-col items-center pr-2 ${
                      idx !== miniInclusions.length - 1
                        ? 'border-r border-gray-400'
                        : ''
                    }`}
                  >
                    <img
                      src={Icon}
                      alt={mi}
                      className="w-5 h-5 sm:w-8 sm:h-8"
                    />
                    <span className="text-xs">{mi}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="border border-black/15 my-4" />

            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 sm:size-5" />
              <span className="text-sm sm:text-md font-bold">
                {packageDetails.Duration.substring(
                  0,
                  packageDetails.Duration.indexOf('s') + 1
                )}{' '}
                /{' '}
                {packageDetails.Duration.substring(
                  packageDetails.Duration.indexOf('s') + 1
                )}
              </span>
            </div>

            <div className="border border-black/15 mt-3" />

            <div className="space-y-2">              
              <div className="bg-gray-100 p-3 sm:p-4 rounded-md">
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-justify">
                  Holiday Type:
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 text-justify">
                  {packageDetails.Categories}
                </p>
              </div>

              <div className="bg-gray-100 p-3 sm:p-4 rounded-md">
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-justify">
                  Country:
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 text-justify">
                  {packageDetails.Countries}
                </p>
              </div>

              <div className="bg-gray-100 p-3 sm:p-4 rounded-md">
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-justify">
                  Cities:
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 text-justify">
                  {packageDetails.Cities}
                </p>
              </div>
            </div>

            <div className="mt-2 ml-2">
              <Button
                onClick={() => {
                  setHolidayEnquiryModalOpen(true);
                  setHasShownAutoPopup(true); // Prevent auto-popup since user manually opened
                }}
                className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-[8px] transition-all font-semibold text-base w-full sm:w-auto"
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {holidayEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg p-6 sm:p-8 w-full max-w-lg relative rounded-2xl">
            <button
              onClick={() => setHolidayEnquiryModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-justify">
              Want to Go For A Memorable Holiday?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={packageDetails?.PackageName || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-[8px] px-4 py-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4 text-justify">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-2.5 text-sm`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Mobile No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXXXXXXX"
                      className={`w-full border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-2.5 text-sm`}
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your E-Mail Address"
                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-2.5 text-sm`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mb-6">
                {(
                  [
                    ['Adult', adults, setAdults],
                    ['Child', children, setChildren],
                    ['Infant', infants, setInfants],
                  ] as [
                    string,
                    number,
                    React.Dispatch<React.SetStateAction<number>>,
                  ][]
                ).map(([label, value, setter]) => (
                  <div key={label} className="text-center">
                    <div className="text-sm font-medium mb-2">{label}</div>
                    <div className="flex items-center border border-gray-300 rounded-[8px] px-3">
                      <button
                        type="button"
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 rounded-full"
                        onClick={() => setter(Math.max(0, value - 1))}
                      >
                        −
                      </button>
                      <span className="px-3">{value}</span>
                      <button
                        type="button"
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 rounded-full"
                        onClick={() => setter(value + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {submitStatus.type && (
                <div
                  className={`p-3 rounded-[8px] mb-4 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Enquire Now'}
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
