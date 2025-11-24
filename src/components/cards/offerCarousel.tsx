import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2, Calendar, Tag } from "lucide-react";

// Types
interface OfferType {
    OfferTypeId: number;
    OfferTypeName: string;
}

interface Offer {
    OfferId: number;
    ThumbnailUrl: string;
    OfferTypeId: number;
    OfferTypeName : string;
    details?: OfferDetails;
    OfferTitle: string;
}

interface OfferDetails {
    OfferTitle: string;
    OfferValidity: string;
    TravelValidity: string;
    DiscountDesc: string;
    BannerUrl: string;
    OfferWebDetails: {
        Services: string;
        MinBookingAmt: number;
        Offers: string;
    }[];
}

interface ArrowProps {
    className?: string;
    onClick?: () => void;
    arrowType: "prev" | "next";
}

// Custom Arrow Component
const CustomArrow: React.FC<ArrowProps> = ({ onClick, arrowType }) => (
    <button
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${
            arrowType === "prev" ? "left-2" : "right-2"
        } bg-white/90 backdrop-blur-sm text-black rounded-full shadow-lg hover:shadow-xl focus:outline-none p-3 hover:bg-[#BC1110] transition-all duration-300`}
        onClick={onClick}
        aria-label={arrowType === "prev" ? "Previous Slide" : "Next Slide"}
    >
        {arrowType === "prev" ? 
            <ChevronLeft className="w-6 h-6 text-black hover:text-white transition-colors" /> : 
            <ChevronRight className="w-6 h-6 text-black hover:text-white transition-colors" />
        }
    </button>
);

// Main Component
const OffersSection: React.FC = () => {
    const [offerTypes, setOfferTypes] = useState<OfferType[]>([]);
    const [selectedType, setSelectedType] = useState<number>(0);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    
    // Fetch Offer Types
    useEffect(() => {
        const fetchOfferTypes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('https://api.nixtour.com/api/List/OfferTypeList');
                if (response.data.Success) {
                    setOfferTypes([
                        { OfferTypeId: 0, OfferTypeName: 'All Offers' },
                        ...response.data.Data
                    ]);
                } else {
                    setError('Failed to fetch offer types');
                }
            } catch (error) {
                console.error('Error fetching offer types:', error);
                setError('Failed to load offer types. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOfferTypes();
    }, []);

    // Fetch Offer Details
    const fetchOfferDetails = async (offerTitle: string): Promise<OfferDetails | null> => {
        try {
            const response = await axios.get(
                `https://api.nixtour.com/api/Web/OfferDetailsByName?OfferTitle=${offerTitle}`
            );
            
            if (response.data.Success) {
                return response.data.Data
            }
            return null;
        } catch (error) {
            console.error(`Error fetching details for offer ${offerTitle}:`, error);
            return null;
        }
    };

    // Fetch Offers
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get("https://api.nixtour.com/api/Web/OfferList");
                if (response.data.Success) {
                    const allOffers = response.data.Data.OfferList;
                    
                    // Fetch details for each offer
                    const offersWithDetails = await Promise.all(
                        allOffers.map(async (offer: any) => {
                            const details = await fetchOfferDetails(offer.OfferTitle);
                            const offerTypeId = getOfferTypeIdFromServices(details?.OfferWebDetails[0]?.Services);
                            return {
                                ...offer,
                                OfferTypeId: offerTypeId,
                                details
                            };
                        })
                    );

                    const filteredOffers = selectedType === 0 
                        ? offersWithDetails 
                        : offersWithDetails.filter((offer: Offer) => offer.OfferTypeId === selectedType);
                        
                    
                    setOffers(filteredOffers);
                } else {
                    setError('Failed to fetch offers');
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
                setError('Failed to load offers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [selectedType]);

    

    // Helper function to determine OfferTypeId based on Services
    const getOfferTypeIdFromServices = (services: string | undefined): number => {
        if (!services) return 6; // Default to Other if no services

        const servicesLower = services.toLowerCase();
        if (servicesLower.includes('flight') || servicesLower.includes('airline')) {
            return 1; // Airline
        } else if (servicesLower.includes('holiday') || servicesLower.includes('package')) {
            return 2; // Holiday
        } else if (servicesLower.includes('hotel') || servicesLower.includes('stay')) {
            return 3; // Hotel
        }
        return 6; // Other
    };

    const handleTabClick = (offerTypeId: number) => {
        setSelectedType(offerTypeId);
    };

    const getDisplayName = (name: string): string => {
        const displayNames: { [key: string]: string } = {
            'All Offers': 'All Offers',
            'Airline': 'Flights',
            'Holiday': 'Holidays',
            'Hotel': 'Hotels',
            'Other': 'More'
        };
        return displayNames[name] || name;
    };

    const thumbnailUrlFormatter = (thumbnailUrl: string) => {
        if (thumbnailUrl.startsWith("img")) {
            return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split("/")[1]}`;
        }
        return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split("\\")[2] || thumbnailUrl}`;
    };

    const settings: Settings = {
        dots: true,
        infinite: false, // Changed to false to prevent infinite loop
        speed: 500,
        slidesToShow: Math.min(3, offers.length), // Show maximum of 3 or total offers available
        slidesToScroll: 1,
        arrows: offers.length > 3, // Show arrows only if more than 3 offers
        autoplay: false, // Disabled autoplay to prevent loops
        prevArrow: <CustomArrow arrowType="prev" />,
        nextArrow: <CustomArrow arrowType="next" />,
        responsive: [
            {
                breakpoint: 1280,
                settings: { 
                    slidesToShow: Math.min(3, offers.length),
                    arrows: offers.length > 3
                },
            },
            {
                breakpoint: 1024,
                settings: { 
                    slidesToShow: Math.min(2, offers.length),
                    arrows: offers.length > 2
                },
            },
            {
                breakpoint: 640,
                settings: { 
                    slidesToShow: 1,
                    arrows: false
                },
            },
        ],
    };

    const handleOfferClick = (offerTitle: string) => {
        const slug = offerTitle
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') 
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        navigate(`/offer/${slug}`);
    };

    if (error) {
        return (
            <div className="w-full min-h-[300px] xs:min-h-[400px] flex items-center justify-center">
                <div className="text-center text-red-600 px-3">
                    <p className="text-lg xs:text-xl font-semibold mb-2">Error</p>
                    <p className="text-sm xs:text-base">{error}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 py-6 xs:py-8">
            {/* Filter Tabs */}
            <div className="w-full mb-6 xs:mb-8 border-b border-gray-200">
                <nav className="flex overflow-x-auto hide-scrollbar">
                    {offerTypes.map((type) => (
                        <button
                            key={type.OfferTypeId}
                            onClick={() => handleTabClick(type.OfferTypeId)}
                            className={`px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200
                                ${selectedType === type.OfferTypeId
                                    ? 'border-[#BC1110] text-[#BC1110]'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }`}
                        >
                            {getDisplayName(type.OfferTypeName)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Offers Carousel */}
            <div className="relative">
                <div className="flex items-center justify-between mb-4 xs:mb-6">
                    <div>
                        <h2 className="text-2xl xs:text-3xl font-bold text-gray-900">Special Offers</h2>
                        <p className="text-gray-600 mt-1 xs:mt-2 text-sm xs:text-base">Discover our exclusive deals and packages</p>
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[300px] xs:min-h-[400px] flex items-center justify-center">
                        <Loader2 className="w-6 xs:w-8 h-6 xs:h-8 animate-spin text-[#BC1110]" />
                    </div>
                ) : offers.length > 0 ? (
                    <div className="relative px-2 xs:px-4">
                        <Slider {...settings}>
                            {offers.map((offer) => (
                                <div
                                    key={offer.OfferId}
                                    className="px-1 xs:px-2 pb-4"
                                    onClick={() => handleOfferClick(offer.OfferTitle)}
                                >
                                    <div className="group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer bg-white max-w-[350px] xs:max-w-[400px] mx-auto">
                                        <div className="overflow-hidden">
                                            <img
                                                src={thumbnailUrlFormatter(offer.ThumbnailUrl || offer.details?.BannerUrl || "")}
                                                alt={offer.details?.OfferTitle || `Offer ${offer.OfferId}`}
                                                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3 xs:p-4">
                                            <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                                {offer.details?.OfferTitle || `Special Offer ${offer.OfferId}`}
                                            </h3>
                                            {offer.details?.OfferWebDetails[0] && (
                                                <div className="flex items-center gap-2 text-xs xs:text-sm text-gray-600 mb-2">
                                                    <Tag className="w-3 xs:w-4 h-3 xs:h-4" />
                                                    <span>{offer.OfferTypeName}</span>
                                                </div>
                                            )}
                                            {offer.details?.OfferValidity && (
                                                <div className="flex items-center gap-2 text-xs xs:text-sm text-gray-600">
                                                    <Calendar className="w-3 xs:w-4 h-3 xs:h-4" />
                                                    <span>Valid until: {offer.details.OfferValidity.split('-')[1]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4">
                                                <p className="text-white text-base xs:text-lg font-semibold">View Details</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="min-h-[300px] xs:min-h-[400px] flex items-center justify-center">
                        <p className="text-gray-500 text-base xs:text-lg">No offers available for this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersSection;