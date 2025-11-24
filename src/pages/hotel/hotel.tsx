import { Navbar } from '../../components/navbar/navbar';
import Footer from '../footer';
// Removed background image - replaced with blue background
import OffersSection from '../../components/cards/offerCarousel';
import TopHotels from '../../components/top-hotels/top-hotels';
import HotelFAQ from '../../components/hotel-faq/hotel-faq';
import { HotelSearch } from '../../components/hotel-search/HotelSearch';
import { MapPin } from 'lucide-react';

function Hotel() {
  return (
    <div>
      <Navbar />
      {/* Blue header */}
      <div className="bg-[#2073C7] flex flex-col items-center justify-center w-full py-12 sm:py-16 md:py-20 lg:py-24  text-center relative">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-2 md:mb-4 text-center">
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
            Hotel{' '}
            <MapPin className="size-7 xs:size-8 sm:size-8 md:size-10 lg:size-12 ml-0.5 sm:ml-1 stroke-1 stroke-white fill-nix-prime hover:fill-nix-prime-hover transition duration-300 ease-in-out" />
          </span>{' '}
          With Nixtour
        </h1>
        <p className="text-base xs:text-lg sm:text-lg md:text-xl text-white mb-3 sm:mb-4 md:mb-6 font-semibold">
          Cheapest Room Rates Guaranteed
        </p>
      </div>
      {/* Hotel Search UI */}
      <div
        className="flex justify-center -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28 mb-10"
        style={{ zIndex: 10, position: 'relative' }}
      >
        <div className="w-full max-w-6xl px-4 sm:px-6 md:px-8">
          <HotelSearch />
        </div>
      </div>
      <div className="my-5">
        <OffersSection />
      </div>
      <div className="px-4 sm:px-6 md:px-20 py-6 mx-auto">
        <TopHotels />
      </div>
      {/* Informational Section */}
      <section className="mx-auto sm:px-24 px-5 sm:py-10 py-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-nix-txt">
          Nixtour Offers the Cheapest Luxury & Budget Hotel Deals
        </h2>
        <p className="mb-6 text-gray-700">
          <b>Nixtour</b> offers a comprehensive lineup of budget, deluxe, and
          luxury hotels to travellers across India. You can expect fabulous
          discounts on your hotel bookings at Nixtour, while we also list the{' '}
          <b>best budget hotels online</b> along with properties of premier
          global brands like the Hilton, Hyatt, Accor, IHG Hotels & Resorts and
          more. Every single hotel on our platform ensures comfortable and
          enjoyable stays for you and your loved ones. Get the{' '}
          <b>cheapest hotel deals</b> in any destination only at Nixtour.
        </p>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-nix-txt">
          Discover Top Premium and Wallet-Friendly Hotels with Nixtour
        </h3>
        <p className="mb-2 text-gray-700">
          <b>Nixtour</b> is one of India's leading online platforms for hotel
          bookings and you can expect to find exclusive selections of leading{' '}
          <i>hotels near you</i>. We have built partnerships with reputed hotel
          chains throughout the country, enabling us to offer you a fabulous
          range of resorts, villas, suites, motels, and more. Choose any
          accommodation that matches your preferences near your destination.
          From business/corporate trips to vacations, we help you find luxury
          properties that surpass client expectations with their amenities and
          service, while giving you a great chance to relax and unwind amidst
          pristine surroundings.
        </p>
        <p className="mb-2 text-gray-700">
          At Nixtour, we pride ourselves on offering unmatched client services,
          which includes round-the-clock customer support and dedicated
          guidance/help for all your queries. We also give you a huge lineup of
          the best hotels, customized trip experiences, and numerous exclusive
          deals and offers. We know that everyone wants reasonably-priced yet
          enjoyable stays across locations. This is why Nixtour aims at offering
          the best solutions to those looking for hotels near me online. Without
          further delays, book your preferred hotels on Nixtour today.
        </p>
      </section>
      {/* FAQ Section */}
      <HotelFAQ />
      <Footer />
    </div>
  );
}

export default Hotel;
