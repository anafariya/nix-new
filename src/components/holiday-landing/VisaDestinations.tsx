import { useState } from 'react';
import WindowLid from '../../assets/images/plane-window-lid.png';
import PlaneBound from '../../assets/images/plane-window-bound.png';
import Dubai from '../../assets/images/Dubai.jpg';
import Bali from '../../assets/images/Bali.jpg';
import Kerala from '../../assets/images/Kerala.webp';
import Jammu from '../../assets/images/jammu.jpg';
import Andaman from '../../assets/images/andaman.jpg';
import Maldives from '../../assets/images/maldives.jpg';
import Kedarnath from '../../assets/images/kedarnath.webp';
import Ladakh from '../../assets/images/Ladakh.webp';
import Mussoorie from '../../assets/images/mussoorie.webp';
import Auli from '../../assets/images/auli-and-chopta.webp';
import Japan from '../../assets/images/maldives.jpg';
import Jodhpur from '../../assets/images/jodhpur.webp';
import Lakshadweep from '../../assets/images/Lakshyadweep.webp';
import Udaipur from '../../assets/images/udaipur.webp';
import Argentina from '../../assets/images/Argentina.jpg';
import Kenya from '../../assets/images/kenya.webp';
import Rajasthan from '../../assets/images/rajasthan.webp';
import Thailand from '../../assets/images/thailand.webp';
import Chardham from '../../assets/images/char dham yatra.webp';
import Paris from '../../assets/images/paris.webp';
import Singapore from '../../assets/images/singapore.webp';
import HongKong from '../../assets/images/hong kong.webp';
import Japan2 from '../../assets/images/Japan.webp';
import Russia from '../../assets/images/russia.webp';
import Dubai2 from '../../assets/images/dubai.webp';
import Baku from '../../assets/images/package copy.webp';
import Vietnam from '../../assets/images/Vietnam.webp';
import Almaty from '../../assets/images/almaty.webp';
import Greece from '../../assets/images/greece.webp';
import Jaisalmer from '../../assets/images/jaisalmer.webp';
import Kashmir from '../../assets/images/kashmeer.webp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';



type Destination = {
  id: number;
  name: string;
  tagline: string;
  price: string;
  image: string;
  bestTimeToVisit: string[];
};



const destinationsByMonth: Record<string, Destination[]> = {
  JAN: [
    {
      id: 1,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['JAN', 'APR'],
      image: Bali,
    },
    {
      id: 2,
      name: 'MALDIVES',
      tagline: 'Paradise on Earth',
      price: '₹45,990*',
      bestTimeToVisit: ['JAN', 'FEB', 'MAR'],
      image: Maldives,
    },
    {
      id: 3,
      name: 'DUBAI',
      tagline: 'City of Gold',
      price: '₹38,990*',
      bestTimeToVisit: ['JAN', 'FEB', 'NOV'],
      image: Dubai,
    },
    {
      id: 4,
      name: 'HONEYMOON',
      tagline: 'Special Packages',
      price: '₹52,990*',
      bestTimeToVisit: ['JAN', 'FEB', 'MAR'],
      image: Bali,
    },
  ],
  FEB: [
    {
      id: 5,
      name: 'ANDAMAN',
      tagline: 'Island Paradise',
      price: '₹29,990*',
      bestTimeToVisit: ['FEB', 'MAR', 'APR'],
      image: Andaman,
    },
    {
      id: 6,
      name: 'KERALA',
      tagline: "God's Own Country",
      price: '₹24,990*',
      bestTimeToVisit: ['FEB', 'MAR'],
      image: Kerala,
    },
    {
      id: 7,
      name: 'JAPAN',
      tagline: 'Land of the Rising Sun',
      price: '₹78,990*',
      bestTimeToVisit: ['FEB', 'MAR', 'APR'],
      image: Japan,
    },
    {
      id: 8,
      name: 'JAMMU',
      tagline: 'Crown of India',
      price: '₹22,990*',
      bestTimeToVisit: ['FEB', 'MAR'],
      image: Jammu,
    },
  ],
  MAR: [
    {
      id: 9,
      name: 'DUBAI',
      tagline: 'City of Gold',
      price: '₹38,990*',
      bestTimeToVisit: ['MAR', 'APR'],
      image: Dubai,
    },
    {
      id: 10,
      name: 'MALDIVES',
      tagline: 'Paradise on Earth',
      price: '₹45,990*',
      bestTimeToVisit: ['MAR', 'APR'],
      image: Maldives,
    },
    {
      id: 11,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['MAR', 'APR'],
      image: Bali,
    },
    {
      id: 12,
      name: 'KERALA',
      tagline: "God's Own Country",
      price: '₹24,990*',
      bestTimeToVisit: ['MAR', 'APR'],
      image: Kerala,
    },
  ],
  APR: [
    {
      id: 13,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['APR', 'MAY'],
      image: Bali,
    },
    {
      id: 14,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['APR'],
      image: Bali,
    },
    {
      id: 15,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['APR'],
      image: Bali,
    },
    {
      id: 16,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['APR'],
      image: Bali,
    },
  ],
  MAY: [
    {
      id: 17,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['MAY'],
      image: Bali,
    },
    {
      id: 18,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['MAY'],
      image: Bali,
    },
    {
      id: 19,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['MAY'],
      image: Bali,
    },
    {
      id: 20,
      name: 'BALI',
      tagline: 'Experience the Magic',
      price: '₹32,990*',
      bestTimeToVisit: ['MAY'],
      image: Bali,
    },
  ],
  JUN: [
    {
      id: 21,
      name: 'KEDARNATH',
      tagline: 'Experince the divine',
      price: '₹13,990*',
      bestTimeToVisit: ['JUN'],
      image: Kedarnath,
    },
    {
      id: 22,
      name: 'LADAKH',
      tagline: 'The heaven on earth',
      price: '₹19,000*',
      bestTimeToVisit: ['JUN'],
      image: Ladakh,
    },
    {
      id: 23,
      name: 'MUSSOORIE',
      tagline: 'The queen of hills',
      price: '₹13,600*',
      bestTimeToVisit: ['JUN'],
      image: Mussoorie,
    },
    {
      id: 24,
      name: 'AULI & CHOPTA',
      tagline: 'The paradise of Uttarakhand',
      price: '₹12,990*',
      bestTimeToVisit: ['JUN'],
      image: Auli,
    },
  ],
  JUL: [
    {
      id: 25,
      name: 'JODHPUR',
      tagline: 'The city of forts',
      price: '₹15,999*',
      bestTimeToVisit: ['JUL'],
      image: Jodhpur,
    },
    {
      id: 26,
      name: 'KERALA',
      tagline: 'Gods own country',
      price: '₹17,300*',
      bestTimeToVisit: ['JUL'],
      image: Kerala,
    },
    {
      id: 27,
      name: 'LAKSHAYADWEEP',
      tagline: 'The paradise of Andaman',
      price: '₹32,999*',
      bestTimeToVisit: ['JUL'],
      image: Lakshadweep,
    },
    {
      id: 28,
      name: 'UDAIPUR',
      tagline: 'The city of lakes',
      price: '₹11,999*',
      bestTimeToVisit: ['JUL'],
      image: Udaipur,
    },
  ],
  AUG: [
    {
      id: 29,
      name: 'KENYA',
      tagline: 'The safari capital of the world',
      price: '₹13,999*',
      bestTimeToVisit: ['AUG'],
      image: Kenya,
    },
    {
      id: 30,
      name: 'RAJASTHAN',
      tagline: 'The land of kings',
      price: '₹13,999*',
      bestTimeToVisit: ['AUG'],
      image: Rajasthan,
    },
    {
      id: 31,
      name: 'THAILAND',
      tagline: 'The land of smiles',
      price: '₹13,999*',
      bestTimeToVisit: ['AUG'],
      image: Thailand,
    },
    {
      id: 32,
      name: 'VIETNAM',
      tagline: 'The land of the rising sun',
      price: '₹13,999*',
      bestTimeToVisit: ['AUG'],
      image: Vietnam,
    },
  ],
  SEP: [
    {
      id: 33,
      name: 'CHARDHAM YATRA',
      tagline: 'The journey of a lifetime',
      price: '₹13,999*',
      bestTimeToVisit: ['SEP'],
      image: Chardham,
    },
    {
      id: 34,
      name: 'BAKU',
      tagline: 'The city of love',
      price: '₹13,999*',
      bestTimeToVisit: ['SEP'],
      image: Baku,
    },
    {
      id: 35,
      name: 'PARIS',
      tagline: 'The city of love',
      price: '₹13,999*',
      bestTimeToVisit: ['SEP'],
      image: Paris,
    },
    {
      id: 36,
      name: 'SINGAPORE',
      tagline: 'The city of love',
      price: '₹13,999*',
      bestTimeToVisit: ['SEP'],
      image: Singapore,
    },
  ],
  OCT: [
    {
      id: 37,
      name: 'HONG KONG',
      tagline: 'The city of skyscrapers',
      price: '₹13,999*',
      bestTimeToVisit: ['OCT'],
      image: HongKong,
    },
    {
      id: 38,
      name: 'JAPAN',
      tagline: 'The land of rising sun',
      price: '₹13,999*',
      bestTimeToVisit: ['OCT'],
      image: Japan2,
    },
    {
      id: 39,
      name: 'RUSSIA',
      tagline: 'The land of the white night',
      price: '₹13,999*',
      bestTimeToVisit: ['OCT'],
      image: Russia,
    },
    {
      id: 40,
      name: 'DUBAI',
      tagline: 'The city of gold',
      price: '₹32,990*',
      bestTimeToVisit: ['OCT'],
      image: Dubai2,
    },
  ],
  NOV: [
    {
      id: 41,
      name: 'MALDIVES',
      tagline: 'Paradise on Earth',
      price: '₹45,990*',
      bestTimeToVisit: ['NOV', 'DEC'],
      image: Maldives,
    },
    {
      id: 42,
      name: 'ANDAMAN',
      tagline: 'Island Paradise',
      price: '₹29,990*',
      bestTimeToVisit: ['NOV', 'DEC'],
      image: Andaman,
    },
    {
      id: 43,
      name: 'ARGENTINA',
      tagline: 'Land of Silver',
      price: '₹92,990*',
      bestTimeToVisit: ['NOV', 'DEC'],
      image: Argentina,
    },
    {
      id: 44,
      name: 'DUBAI',
      tagline: 'City of Gold',
      price: '₹38,990*',
      bestTimeToVisit: ['NOV', 'DEC'],
      image: Dubai,
    },
  ],
  DEC: [
    {
      id: 45,
      name: 'ALMATY',
      tagline: 'The city of the white night',
      price: '₹13,999*',
      bestTimeToVisit: ['DEC'],
      image: Almaty,
    },
    {
      id: 46,
      name: 'GREECE',
      tagline: 'The land of the sun',
      price: '₹13,999*',
      bestTimeToVisit: ['DEC'],
      image: Greece,
    },
    {
      id: 47,
      name: 'JAISALMER',
      tagline: 'The city of the sun',
      price: '₹13,999*',
      bestTimeToVisit: ['DEC'],
      image: Jaisalmer,
    },
    {
      id: 48,
      name: 'KASHMIR',
      tagline: 'The paradise of the world',
      price: '₹13,999*',
      bestTimeToVisit: ['DEC'],
      image: Kashmir,
    },
  ],
};

export default function VisaDestinations() {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);

  const destinations = destinationsByMonth[selectedMonth] || [];

  return (
    <section className="py-8 xs:py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="px-3 xs:px-4">
        <h3 className="text-nix-prime text-base xs:text-lg sm:text-[20px] font-semibold text-center">
          Wanna Know
        </h3>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-[48px] text-nix-txt text-center font-extrabold mb-4 xs:mb-6">
          When to go Where?
        </h2>

        <div className="relative flex flex-wrap justify-center gap-2 xs:gap-3 mb-4 xs:mb-6">
          {months.map((month) => (
            <div key={month} className="relative">
              <button
                onClick={() => setSelectedMonth(month)}
                className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-3 rounded border text-sm xs:text-base sm:text-lg font-semibold transition-all
          ${selectedMonth === month
                    ? 'bg-nix-prime text-white border-nix-prime'
                    : 'bg-nix-white text-nix-txt border-nix-prime hover:text-nix-white hover:bg-nix-prime-hover'
                  }`}
              >
                {month}
              </button>

              {selectedMonth === month && (
                <div className="absolute left-1/2 -bottom-[4px] xs:-bottom-[6px] -translate-x-1/2 w-0 h-0 border-l-6 xs:border-l-8 border-r-6 xs:border-r-8 border-t-6 xs:border-t-8 border-l-transparent border-r-transparent border-t-nix-prime" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-nix-prime w-full flex justify-center py-6 xs:py-8 sm:py-10">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="max-w-[95%] xs:max-w-[90%] md:max-w-[80%] mx-auto px-4 sm:px-6"
          >
                          {destinations.map((destination, index) => (
                <SwiperSlide className='flex justify-center' key={destination.id}>
                  <div
                    className={`relative aspect-[28/37] w-[280px] xs:w-[320px] sm:w-[400px] md:w-[480px] rounded-[200px] xs:rounded-[250px] sm:rounded-[300px] bg-white shadow-lg overflow-hidden group ${index !== 0 ? 'backdrop-blur-sm' : ''
                      }`}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />

                    <img
                      src={WindowLid}
                      alt="lid"
                      className="absolute inset-0 w-full h-full opacity-90 top-0 transform transition-transform duration-500 ease-in group-hover:translate-y-[-71%]"
                    />

                    <img
                      src={PlaneBound}
                      alt="bound"
                      className="absolute inset-0 w-full h-full top-0"
                    />
                  </div>
                </SwiperSlide>
              ))}

          </Swiper>
        </div>
      </div>
    </section>
  );
}
