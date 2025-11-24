import React, { useState, useEffect } from "react";

import FlightSearch from "../../components/flight-search/flight-search";

import DomesticAirlines from "../../components/domestic-airlines/domestic-airlines";
import InternationalAirline from "../../components/international-airlines/international-airlines";
import Flexible from "../../assets/images/Flexible booking.png";
import flight from "../../assets/images/No flight.png";
import Incredible from "../../assets/images/incredible deals.png";
import Help from "../../assets/images/help 24X7.png";
import FlightDeals from "../../components/flight-deals/flight-deals";
import { Button } from "../../components/ui/button";
import FAQSection from "../../components/accordian/accordian";
// Removed background images - replaced with blue background
import { Navbar } from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { useCitiesStore } from "../../../stores/flightStore";
import OffersSection from "../../components/cards/offerCarousel";
import { MapPin } from "lucide-react";
import TrustindexReviews from "../../components/trustindex-reviews/trustindex-reviews";
import FlightRoutesList from "../../components/flight-routes/FlightRoutesList";

interface Airline {
  AirlineId: number;
  AirlineName: string;
  AirlineType: string;
  CallSign: string;
  IataCode: string;
  IcaoCode: string;
  IsActive: boolean | null;
  ImageUrl: string;
}

const Home = () => {
  const [showMore, setShowMore] = useState(false);
  const [domesticAirlines, setDomesticAirlines] = useState<Airline[]>([]);
  const [internationalAirlines, setInternationalAirlines] = useState<Airline[]>([]);
  const searchRef = React.createRef<HTMLDivElement>();

  const { fetchAirlines, airlines, error } = useCitiesStore();

  useEffect(() => {
    fetchAirlines();
  }, [fetchAirlines]);

  useEffect(() => {
    if (airlines) {
      const domestic: Airline[] = airlines.filter((airline) => airline.AirlineType === "Domestic");
      const international: Airline[] = airlines.filter((airline) => airline.AirlineType === "International");

      setDomesticAirlines(domestic);
      setInternationalAirlines(international);
    }

    if (error) {
      // Handle error silently
    }
  }, [airlines, error]);

  // Add script injection effect
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="trustindex.io"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.trustindex.io/loader.js?c6f809748a5d14866856cf533dc';
    script.defer = true;
    script.async = true;

    // Find the container and append the script there
    const container = document.getElementById('trustindex-reviews-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Cleanup: remove the script when component unmounts
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Blue header */}
        <div className="bg-[#2073C7] py-16 xs:py-20 sm:py-24 md:py-28 text-center">
          <div className="w-full max-w-[98%] xs:max-w-[95%] md:max-w-[85%] lg:max-w-[80%] mx-auto text-center px-3 xs:px-4 sm:px-6">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2 xs:px-4 leading-tight">
          Book Your{' '}
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
                Air Ticket{' '}
                <MapPin className="size-5 xs:size-6 sm:size-7 md:size-10 lg:size-12 ml-0.5 sm:ml-1 stroke-1 stroke-white fill-nix-prime hover:fill-nix-prime-hover transition duration-300 ease-in-out" />
              </span>{' '}
              With Nixtour
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl md:font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2">
              Cheapest & Best Flight Deals
            </p>
          </div>
        </div>
        {/* Flight Search UI */}
        <div ref={searchRef} className="flex justify-center -mt-20 xs:-mt-24 sm:-mt-28 md:-mt-36 mb-6 xs:mb-8 sm:mb-10 px-3 xs:px-4">
          <div className="w-full max-w-[95%] xs:max-w-[90%] md:max-w-2xl">
            <FlightSearch />
          </div>
        </div>
        <div className="lg:px-[112px] md:px-12 sm:px-6 px-3 xs:px-4">
          <div className="my-4 xs:my-5">
            <OffersSection />
          </div>
          <div className="my-4 xs:my-5">
            <DomesticAirlines airlines={domesticAirlines} />
            <InternationalAirline airlines={internationalAirlines} />
          </div>
          <div className="mt-4 xs:mt-5">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 text-left px-1">Why Book With Nixtour?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              <img className="object-cover w-full h-16 xs:h-20 sm:h-24 md:h-32 rounded-lg" src={Flexible} alt="Flexible booking" />
              <img className="object-cover w-full h-16 xs:h-20 sm:h-24 md:h-32 rounded-lg" src={flight} alt="No flight cancellation fee" />
              <img className="object-cover w-full h-16 xs:h-20 sm:h-24 md:h-32 rounded-lg" src={Incredible} alt="Incredible deals" />
              <img className="object-cover w-full h-16 xs:h-20 sm:h-24 md:h-32 rounded-lg" src={Help} alt="Help 24x7" />
            </div>
          </div>
          <div className="my-4 xs:my-5">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4 text-left px-1">Best Deals on Flight Tickets</h2>
            <FlightDeals scrollRef={searchRef} />
          </div>
          <div className="mx-auto mb-6 xs:mb-8">
            <div className="pt-4 xs:pt-6">
              <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4 lg:text-left px-1">
                Book Domestic & International Flights Online with NixTour
              </h1>
              <div className="space-y-3 text-sm xs:text-base leading-relaxed text-justify px-1">
                <p>
                  NixTour is an IATA-accredited travel agency—the one-stop travel solution for all your needs. We are{" "}
                  <span className="font-bold">India's fastest-emerging online travel</span> website and have a
                  customer-centric approach. We have been serving the field since 2015.
                </p>
                <p>
                  We are experts in offering customers a wide array of seamless and convenient travel solutions.
                  With our strategically developed services, we have served more than one million passengers to date.
                </p>
                <p>Our well-arranged services include easy and Convenient Air Ticket booking processes both online and offline. As the fastest-growing online travel portal, we ensure quick customer delivery and turnaround time.</p>
                <p>Customers enjoy a pure refund because our transparent refund procedure includes complimentary rescheduling and refunds adhering to transparent Airline & DGCA Protocol. Moreover, we proudly offer customers the most affordable services, such as online air ticket booking.</p>
                <p>We also specialize in special Student Airfares. Each Student is our top priority because we offer them an extra luggage allowance and discounted airfare up to 15%—20%; however, such offers depend on the airline's terms and conditions.</p>
                <p>Our service management department ensures that each customer is handled properly. The team's components include seamless access to services, easy checkout, free rescheduling, and easy refunds.</p>
                {showMore && (
                  <>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Book Flight Ticket Online</h2>
                    <p>
                      In this digital era, booking flight tickets online has emerged as a convenient and seamless procedure, whether you are planning your trip to a domestic or international destination.
                      You can enjoy many facilities by selecting the online mode for Air ticket booking. Most primarily, you can easily compare the price and service of the air tickets and decide on the cheapest flight available.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Book Cheapest Flight Tickets Online</h2>
                    <p>
                      Finding and booking the cheapest flight tickets can be challenging, but with nixtour.com easy interface, it can be done within seconds. You can browse for 100o's of airline tickets and save money on the final checkout.
                      The most significant advantages of booking online flight tickets are money, time, and transparency savings. Whenever you browse a flight ticket, an essential factor in the ticket pricing trend can be rewarding to save money on flight tickets, which you should follow.
                      Here are more factors to consider when booking a cheaper flight and saving money by following the ticket pricing trend.
                      Air ticket prices typically fluctuate based on travel demand. By being flexible on your travel date, you can book lower-price flight tickets during off-peak times. Enabling NixTour's notification can help you do so.
                      Using NixTour's fare comparison tool, one can easily compare prices and airline availability for a particular route. This can help identify the cheapest flight options.
                      Booking your flight ticket during last-minute deals can also be helpful. Airlines organize last-minute deals in case the flight is full or there is a shortage of passengers.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Book National & International Flight Tickets Online</h2>
                    <p>
                      Several online platforms offer many booking options for national or international flights. NixTour is beyond all such platforms, offering a diverse range of convenience and flexibility. With NixTour's flight ticket booking portal, one can access many additional features compared to other platforms.
                      NixTour offers an AI algorithm that helps customers compare routes, airlines, and prices for their entire journey and its expenses so that they can easily find the best deal. With a unique integration of fare alerts, travellers can receive the most prior notification whenever ticket prices fluctuate, or there is a price drop for a selected destination.
                      Moreover, booking international flights online allows you to access multiple additional options. For any national or international destination, one can choose the flight that fits their schedule, preference, and budget. Online ticket booking platforms are an easy and convenient way to arrange a vacation, a family visit, or a business trip.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Book Flight Tickets At Cheapest Prices</h2>
                    <p>
                      Are you looking for cheap flight options? Services offered by cost carriers are the best pick in such cases. Several cost carriers and airlines offer lower rates compared to full-service counterparts.
                      NixTour allows you to filter such cost carrier flights to meet your budget needs through their easily navigable site elements.
                      Moreover, credit cards could save you more money when booking online air tickets. Almost every credit card company provides rewards, cashback, and even points that can be redeemed to save even more money.
                      It will reduce your overall travel expenses. Another benefit of using credit cards for booking flight tickets is garnering zero or low convenience fees.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Get Special Discount On Flights Tickets</h2>
                    <p>
                      Can you save additional expenses other than saving on airline services? It can be accessed through some of the most renowned and valuable ticket-booking agencies offering dedicated discounts, deals, and offers. These offers may be subject to limited-time deals, but only some provide evergreen services, such as NixTour.
                      NixTour is one such agency that offers additional rewarding benefits so you can book flights without considering any burden on your budget. NixTour provides multi-category discounts such as special fares and student fares. If you are a student, you can get additional benefits under a special student discount.
                      For those who will book flight tickets under student fares, NixTour will offer them an additional 5% to 10% discount on their flight tickets. Students who arrange their occupancy in economy or economy flexi classes can claim such an offer. Moreover, one must keep an eye on the ticket pricing trend so that they can board the cheapest flight available.
                    </p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Conclusion</h2>
                    <p>
                      Travelling has evolved as a mandatory need for us. Meanwhile, airlines offer the fastest means of transport, but at the same time, they charge a considerable amount. In the crowded market of ticket booking agencies, some reputable centres offer seamless flight booking services and let you browse and select the cheapest flight available. Moreover, the agencies provide additional fares and discounts. The write-up is aimed at one such agency, NixTour. You can visit the official website and browse for the cheapest and best flight options.
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-center mt-6 xs:mt-8 px-2">
                <Button
                  variant="outline"
                  className="border-2 hover:bg-gray-100 font-semibold hover:text-black text-sm xs:text-base px-4 xs:px-6 py-2 xs:py-3"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Read Less" : "Click Here To Know More About Us"}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 xs:mt-5">
            <FAQSection />
          </div>
        </div>
        {/* Flight Routes List - displayed above footer */}
        <div className="mt-8 mb-6">
          <FlightRoutesList className="lg:px-[112px] md:px-12 sm:px-6 px-3 xs:px-4" />
        </div>
        <TrustindexReviews />
        <Footer />
      </div>
    </div>
  );
};

export default Home;