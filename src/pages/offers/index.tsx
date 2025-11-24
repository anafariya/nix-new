import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import { useState, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import axios from 'axios'
import TrustindexReviews from '../../components/trustindex-reviews/trustindex-reviews'

interface OfferItem {
    OfferId: number;
    ThumbnailUrl: string;
    OfferTitle: string;
    OfferTypeId: number;
    OfferTypeName: string;
    OfferEndDate: string;
}

interface ApiResponse {
    Success: boolean;
    StatusCode: number;
    Message: string;
    Data: {
        CmdStatus: number;
        CmdMessage: string;
        OfferList: OfferItem[];
    };
    errors: null;
}

function Offers() {
    const [activeTab, setActiveTab] = useState('All Offers')
    const [currentSlide, setCurrentSlide] = useState(0)
    const [offers, setOffers] = useState<OfferItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const tabs = ['All Offers', 'Flights', 'Holidays', 'Hotels', 'More']

    // Fetch offers from API
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true)
                const response = await axios.get<ApiResponse>('https://api.nixtour.com/api/Web/OfferList')
                if (response.data.Success && response.data.Data.OfferList) {
                    setOffers(response.data.Data.OfferList)
                } else {
                    setError('Failed to fetch offers')
                }
            } catch (error) {
                console.error('Error fetching offers:', error)
                setError('Failed to fetch offers')
            } finally {
                setLoading(false)
            }
        }

        fetchOffers()
    }, [])

    // Get 3-4 random offers for the hero slider
    const sliderOffers = useMemo(() => {
        if (!offers.length) return []

        // Shuffle a shallow copy of offers and pick first 4 (or fewer if not enough)
        const shuffled = [...offers].sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, Math.min(4, shuffled.length))

        return selected.map((offer) => ({
            id: offer.OfferId,
            title: offer.OfferTitle,
            subtitle: `Valid until ${offer.OfferEndDate}`,
            image: offer.ThumbnailUrl
        }))
    }, [offers])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderOffers.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderOffers.length) % sliderOffers.length)
    }

    // Auto slide functionality
    useEffect(() => {
        if (sliderOffers.length > 1) {
            const interval = setInterval(nextSlide, 5000) // Auto slide every 5 seconds
            return () => clearInterval(interval)
        }
    }, [sliderOffers.length])

    // Filter offers based on active tab
    const getFilteredOffers = () => {
        if (activeTab === 'All Offers') {
            return offers
        }

        const typeMap: { [key: string]: string } = {
            'Flights': 'Airline',
            'Holidays': 'Holiday',
            'Hotels': 'Hotel',
            'More': 'Other'
        }

        const targetType = typeMap[activeTab]
        return offers.filter(offer => offer.OfferTypeName === targetType)
    }

    // Get image URL from thumbnail path
    const getImageUrl = (thumbnailUrl: string) => {
        if (!thumbnailUrl) return '/api/placeholder/400/200'
        const imageName = thumbnailUrl.split('\\').pop()
        return `https://api.nixtour.com/api/Image/GetImage/${imageName}`
    }

    // Create slug from offer title
    const createSlugFromTitle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') 
            .replace(/\s+/g, '-') 
            .replace(/-+/g, '-') 
            .trim();
    }

    // Handle offer click
    const handleOfferClick = (offer: OfferItem) => {
        const slug = createSlugFromTitle(offer.OfferTitle);
        window.location.href = `/offer/${slug}`
    }

    return (
        <div className='min-h-screen'>
            <Navbar />

            {/* Hero Banner Slider - Clean Image Only */}
            <div className="relative mx-auto px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48 py-8">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    {sliderOffers.length > 0 && (
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {sliderOffers.map((offer) => (
                                <div key={offer.id} className="w-full flex-shrink-0 relative">
                                    <img
                                        src={getImageUrl(offer.image)}
                                        alt={offer.title}
                                        className="w-full h-64 md:h-80 lg:h-[70vh] object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/api/placeholder/800/400';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {sliderOffers.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </>
                    )}

                    {/* Slide Indicators */}
                    {sliderOffers.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {sliderOffers.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                                            ? 'bg-white scale-125'
                                            : 'bg-white/60 hover:bg-white/80'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <div className="mx-auto px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                        ? 'border-[#BC1110] text-[#BC1110]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="py-8">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {activeTab === 'All Offers' ? 'Special Offers' : activeTab}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {activeTab === 'All Offers'
                                ? 'Discover our exclusive deals and packages'
                                : `Discover our exclusive ${activeTab.toLowerCase()} deals and packages`
                            }
                        </p>

                        {/* Offers Grid */}
                        {loading ? (
                            <div className="bg-gray-50 rounded-lg p-12">
                                <p className="text-gray-500 text-lg">Loading offers...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 rounded-lg p-12">
                                <p className="text-red-500 text-lg">{error}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getFilteredOffers().map((offer) => (
                                    <div
                                        key={offer.OfferId}
                                        className="bg-white rounded-[12px] shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => handleOfferClick(offer)}
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={getImageUrl(offer.ThumbnailUrl)}
                                                alt={offer.OfferTitle}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/api/placeholder/400/200';
                                                }}
                                            />
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-[#BC1110] text-white px-2 py-1 rounded text-xs font-bold">
                                                    {offer.OfferTypeName}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                                {offer.OfferTitle}
                                            </h3>
                                            <p className="text-gray-600 flex items-center gap-2 mb-2 text-sm">
                                                <Tag className='w-4 h-4' />  {offer.OfferTypeName}
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-2 text-sm">
                                                <Calendar className='w-4 h-4' />  Valid until: {offer.OfferEndDate}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <TrustindexReviews />

            <Footer />
        </div>
    )
}

export default Offers