import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Plane, MapPin, Calendar, Info } from 'lucide-react';
import CanonicalTag from '../../components/canonicalTag';
import DetailsPageFaq from '../../components/DetailsPageFaq/DetailsPageFaq';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

interface FlightRouteDetails {
  FlightRoutesId?: number;
  Title: string;
  Description: string;
  Keywords: string;
  FromCity?: string;
  ToCity?: string;
  Airline?: string;
  Content: string;
  DepCity: string;
  ArrCity: string;
  DepCityName: string;
  ArrCityName: string;
  IntAirline: string;
  Dep: string;
  Arr: string;
  DepDt: string;
  RouteName: string;
  FlightRoutes: Array<{
    AirlineName: string;
    AirlineLogo: string;
    IntAirline: string;
    RouteName: string;
  }>;
  faqModels: Array<{
    Question: string;
    Answer: string;
  }>;
}

export default function FlightRouteDetailsPage() {
  const [routeDetails, setRouteDetails] = useState<FlightRouteDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Get flight route ID from sessionStorage (set by FlightRoutesList component)
    const flightRouteId = sessionStorage.getItem('selectedFlightRouteId');

    // Check if the current path looks like a flight route (contains keywords like "to", "tickets")
    const currentPath = location.pathname;
    const isFlightRoutePath =
      currentPath.includes('-to-') && currentPath.includes('tickets');

    if (flightRouteId) {
      fetchFlightRouteDetails(Number(flightRouteId));
    } else if (isFlightRoutePath) {
      // If it looks like a flight route path but no ID in sessionStorage,
      // we could try to find the route by URL or show a generic message
      setError(
        'Flight route details not available - please navigate from the flight routes list'
      );
      setLoading(false);
    } else {
      // This doesn't look like a flight route, redirect to 404
      window.location.href = '/404';
    }
  }, [location]);

  const fetchFlightRouteDetails = async (flightRoutesId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.nixtour.com/api/Web/FlightRouteDetails?flightRoutesId=${flightRoutesId}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Flight Route Details API Response:', result);

        // Handle different response formats
        let detailsData = null;
        if (result.Data) {
          detailsData = result.Data;
          console.log('Using result.Data:', detailsData);
        } else if (result.FlightRoutes) {
          detailsData = result.FlightRoutes;
          console.log('Using result.FlightRoutes:', detailsData);
        } else {
          detailsData = result;
          console.log('Using result directly:', detailsData);
        }

        console.log('Final detailsData being set:', detailsData);
        setRouteDetails(detailsData);
      } else {
        console.error(
          'API Response not OK:',
          response.status,
          response.statusText
        );
        setError('Failed to fetch flight route details');
      }
    } catch (err) {
      console.error('Error in fetchFlightRouteDetails:', err);
      setError('Error fetching flight route details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!routeDetails) return;

    console.log('Flight search parameters from API:', {
      DepCity: routeDetails.DepCity,
      ArrCity: routeDetails.ArrCity,
      IntAirline: routeDetails.IntAirline,
      Dep: routeDetails.Dep,
      Arr: routeDetails.Arr,
      DepDt: routeDetails.DepDt,
    });

    // Use the existing flight search system with parameters from Flight Route Details API
    const url = new URL('https://fares.nixtour.com/Metabook/Home/Landing');
    const params: { [key: string]: string } = {
      CompanyId: 'KN2182',
      LanguageCode: 'GB',
      FlightMode: 'I',
      JourneyType: 'O', // One way by default
      websiteId: '13671',
      ClientId: '',
      SalesChannel: 'Online-DC',
      AgentName: '',
      SearchType: 'Flight',
      CabinClass: '3', // Economy by default
      Dep: routeDetails.Dep || '', // Airport code from API
      Arr: routeDetails.Arr || '', // Airport code from API
      DepDt: dayjs().add(1, 'day').format('DD-MMM-YYYY'), // Use tomorrow's date for actual search
      RetDt: '',
      Adt: '1', // 1 adult by default
      Chd: '0', // 0 children
      Inf: '0', // 0 infants
      cl: '3', // Economy
      DirectFlight: 'False',
      IntAirline: routeDetails.IntAirline || '', // Airline code from API
      DepCity: routeDetails.DepCity || '',
      ArrCity: routeDetails.ArrCity || '',
      LCCRTChkBox: '',
      DepDate: dayjs().add(1, 'day').format('DD-MMM-YYYY'), // Use tomorrow's date for actual search
      RetDate: '',
      Airline: '',
      Flexi: 'False',
      comp_currency: 'INR',
      uid: uuidv4(),
      DepCountryCode: '', // Will be set if available
      ArrCountryCode: '', // Will be set if available
      IsLogin: 'false',
      BranchId: '2214',
    };

    // Add all parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    console.log('Redirecting to flight search with URL:', url.toString());

    // Navigate to flight search with pre-filled parameters
    window.open(url.toString(), '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] overflow-x-hidden max-w-full">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <div className="text-center">
            <div className="text-gray-600">Loading flight route details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !routeDetails) {
    return (
      <div className="min-h-screen bg-[#ffffff] overflow-x-hidden max-w-full">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <div className="text-center">
            <div className="text-red-600">
              {error || 'Flight route not found'}
            </div>
            <p className="mt-4 text-gray-600">
              Please navigate to this page from the flight routes list on our
              home page.
            </p>
            <Button
              onClick={() => (window.location.href = '/')}
              className="mt-4 bg-[#BC1110] hover:bg-[#BC1110]/90 text-white"
            >
              Go to Home Page
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] overflow-x-hidden max-w-full">
      <Helmet>
        <title>{routeDetails.Title || 'Flight Route Details - NixTour'}</title>
        <meta
          name="description"
          content={routeDetails.Description || 'Book flights with NixTour'}
        />
        <meta
          name="keywords"
          content={routeDetails.Keywords || 'flights, travel, booking'}
        />
      </Helmet>
      <CanonicalTag />
      <Navbar />

      {/* Blue gradient header section */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#2E5C8A] pt-16 sm:pt-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-white pb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 break-words">
              {routeDetails?.FlightRoutes[0]?.AirlineName && (
                <span>
                  {routeDetails?.FlightRoutes[0]?.AirlineName} Airline
                </span>
              )}{' '}
              {routeDetails.DepCityName} to {routeDetails.ArrCityName} Flights
            </h1>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
              Book cheap flights from {routeDetails.DepCityName} to{' '}
              {routeDetails.ArrCityName} with best deals
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-8 pt-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6 sm:space-y-8 min-w-0">
            {/* Route Information Card */}
            <Card className="border border-[#e5e7eb] p-1">
              <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-black">
                  <Info className="h-5 w-5 flex-shrink-0" />
                  <span className="text-base sm:text-[18px] break-words">
                    {routeDetails.DepCityName} to {routeDetails.ArrCityName}{' '}
                    Flight Information
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-[#e5e7eb] last:border-b-0">
                    <dt className="font-medium text-[#1f2937] mb-1 sm:mb-0 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      From City
                    </dt>
                    <dd className="text-[#4b5563] break-words">
                      {routeDetails.DepCityName || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-[#e5e7eb] last:border-b-0">
                    <dt className="font-medium text-[#1f2937] mb-1 sm:mb-0 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      To City
                    </dt>
                    <dd className="text-[#4b5563] break-words">
                      {routeDetails.ArrCityName || 'N/A'}
                    </dd>
                  </div>
                  {routeDetails.FlightRoutes &&
                    routeDetails.FlightRoutes.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-[#e5e7eb] last:border-b-0">
                        <dt className="font-medium text-[#1f2937] mb-1 sm:mb-0 flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-600" />
                          Airline
                        </dt>
                        <dd className="text-[#4b5563] break-words">
                          {routeDetails.FlightRoutes[0].AirlineName}
                        </dd>
                      </div>
                    )}
                  {routeDetails.Dep && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-[#e5e7eb] last:border-b-0">
                      <dt className="font-medium text-[#1f2937] mb-1 sm:mb-0">
                        Departure Code
                      </dt>
                      <dd className="text-[#4b5563] font-mono">
                        {routeDetails.Dep}
                      </dd>
                    </div>
                  )}
                  {routeDetails.Arr && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-[#e5e7eb] last:border-b-0">
                      <dt className="font-medium text-[#1f2937] mb-1 sm:mb-0">
                        Arrival Code
                      </dt>
                      <dd className="text-[#4b5563] font-mono">
                        {routeDetails.Arr}
                      </dd>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content Section */}
            {routeDetails.Content && (
              <Card className="border border-[#e5e7eb] p-1">
                <CardHeader className="bg-white">
                  <CardTitle className="text-[#1f2937] text-base sm:text-lg break-words">
                    About {routeDetails.DepCityName} to{' '}
                    {routeDetails.ArrCityName} Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-[#0f172a]">
                  <div
                    className="text-[#4b5563] text-sm break-words text-justify prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: routeDetails.Content }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Book Your Flight - Mobile Only (shown before FAQ) */}
            <div className="lg:hidden">
              <Card className="border border-[#e5e7eb] p-1">
                <CardHeader className="bg-white">
                  <CardTitle className="text-base sm:text-lg text-[#1f2937] break-words">
                    Book Your Flight
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-[#4b5563] text-sm mb-4 break-words">
                      Ready to book your flight from {routeDetails.DepCityName}{' '}
                      to {routeDetails.ArrCityName}?
                    </p>
                    <Button
                      onClick={handleBookNow}
                      className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQs Section */}
            {routeDetails.faqModels && routeDetails.faqModels.length > 0 && (
              <DetailsPageFaq faqs={routeDetails.faqModels} />
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-4 sm:space-y-6 min-w-0">
            <Card className="border border-[#e5e7eb] p-1">
              <CardHeader className="bg-white">
                <CardTitle className="text-base sm:text-lg text-[#1f2937] break-words">
                  Book Your Flight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-[#4b5563] text-sm mb-4 break-words">
                    Ready to book your flight from {routeDetails.DepCityName} to{' '}
                    {routeDetails.ArrCityName}?
                  </p>
                  <Button
                    onClick={handleBookNow}
                    className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
