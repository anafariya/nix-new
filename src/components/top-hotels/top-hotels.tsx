import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import waydham from '../../assets/hotels/wyndham thumbnail size  copy.webp'
import itc from '../../assets/hotels/thumbnail size itc copy.webp'
import taj from '../../assets/hotels/Taj hotel thumbnail size. copy.webp'
import raddisson from '../../assets/hotels/radisson thumbnail size  copy.webp'
import obiroe from '../../assets/hotels/obroi thumbnail size logo  copy.webp'
import marriot from '../../assets/hotels/Marriott_hotels_logo-02 copy.webp'
import hyatt from '../../assets/hotels/hyatt thumbnail size copy.webp'
import holidayIn from '../../assets/hotels/Holiday_Inn_Logo-02 copy.webp'
import hilton from '../../assets/hotels/hilton thumnail size copy.webp'
import accor from '../../assets/hotels/accor logo (1)-02 copy.webp'
import { useLocation } from 'react-router-dom';

interface ArrowProps {
    className?: string;
    onClick?: () => void;
    arrowType: 'prev' | 'next';
}

const CustomArrow: React.FC<ArrowProps> = ({ onClick, arrowType, className }) => (
    <button
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${arrowType === 'prev' ? 'left-2' : 'right-2'
            } bg-white/90 backdrop-blur-sm text-black rounded-full shadow-lg hover:shadow-xl focus:outline-none p-3 hover:bg-[#BC1110] transition-all duration-300 ${className}`}
        onClick={onClick}
        aria-label={arrowType === 'prev' ? 'Previous Slide' : 'Next Slide'}
    >
        {arrowType === 'prev' ?
            <ChevronLeft className="w-6 h-6 text-black hover:text-white transition-colors" /> :
            <ChevronRight className="w-6 h-6 text-black hover:text-white transition-colors" />
        }
    </button>
);

const hotels = [
    {
        name: "Hilton Hotel and Resorts",
        rating: 4.8,
        image: hilton
    },
    {
        name: "Hyatt Regency",
        rating: 4.9,
        image: hyatt
    },
    {
        name: "Marriott Hotels",
        rating: 4.7,
        image: marriot
    },
    {
        name: "Holiday Inn",
        rating: 4.6,
        image: holidayIn
    },
    {
        name: "Oberoi Hotels",
        rating: 4.9,
        image: obiroe
    },
    {
        name: "Radisson Hotels",
        rating: 4.9,
        image: raddisson
    },
    {
        name: "Taj Hotels",
        rating: 4.9,
        image: taj
    },
    {
        name: "ITC Hotels",
        rating: 4.9,
        image: itc
    },
    {
        name: "Wyndham Hotels",
        rating: 4.8,
        image: waydham
    },
    {
        name: "Accor Hotels",
        rating: 4.7,
        image: accor
    }
];

function TopHotels() {
    const location = useLocation();
    return (
        <section className="w-full py-16">
            <div className="mx-auto px-4">
                <div className="text-left mb-4">
                    <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-3">{location.pathname === '/b2bagents' ? 'Special Hotel Rates' : 'Top Hotels'}</h2>
                    <p className="text-gray-600">{location.pathname === '/b2bagents' ? null : 'Discover our handpicked selection of luxury accommodations'}</p>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.custom-prev',
                            nextEl: '.custom-next',
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="w-full"
                    >
                        {hotels.map((hotel, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-md transition-shadow duration-300 my-4 border border-gray-200">
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            className="w-full h-full object-contain bg-gray-50 p-4 transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <p className="text-white text-lg font-semibold">View Details</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 truncate max-w-[70%]">{hotel.name}</h3>
                                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm font-semibold text-gray-700">{hotel.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        <CustomArrow arrowType="prev" className="custom-prev" />
                        <CustomArrow arrowType="next" className="custom-next" />
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default TopHotels; 