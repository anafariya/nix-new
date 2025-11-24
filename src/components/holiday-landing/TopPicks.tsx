import { LucideLoader } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import placeholderPackage from '../../assets/images/pkg-1.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { createHolidaySlug, getMiniInclusionIcon } from '../../../lib/utils';

interface IBestPackage {
  ThumbnailImage: string;
  PackageName: string;
  PackageId: number;
  StartingPrice: number;
  MiniInclusions: string;
  Duration: string;
}

const TopPicks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bestPackages, setBestPackages] = useState<IBestPackage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestHolidayPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          'https://api.nixtour.com/api/Web/Holiday'
        );
        if (response.data.Success) {
          setBestPackages(response.data.Data.BestPackages);
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

    fetchBestHolidayPackages();
  }, []);

  const thumbnailUrlFormatter = (thumbnailUrl: string) => {
    if (thumbnailUrl.startsWith('img')) {
      return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split('/')[1]}`;
    }
    return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split('\\')[2] || thumbnailUrl}`;
  };

  const handleNavigateToPackage = (pkg: IBestPackage, withEnquiry: boolean = false) => {
    // Use PackageName directly as URL slug
    const packageNameSlug = createHolidaySlug(pkg.PackageName);
    const targetUrl = `/holiday/${packageNameSlug}${withEnquiry ? '?enquiry=true' : ''}`;
    navigate(targetUrl);
  };

  const handleCardClick = (pkg: IBestPackage) => {
    handleNavigateToPackage(pkg, false);
  };

  const handleGetQuote = (e: React.MouseEvent, pkg: IBestPackage) => {
    e.stopPropagation();
    handleNavigateToPackage(pkg, true);
  };

  const PackageCard = ({ pkg }: { pkg: IBestPackage }) => {
    const miniInclusions = pkg?.MiniInclusions?.split(', ') ?? [];

    return (
      <div
        onClick={() => handleCardClick(pkg)}
        className="cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm w-full max-w-[280px] mx-auto h-[440px] flex flex-col"
      >
        {/* Image container */}
        <div className="w-full h-40 relative">
          <img
            src={
              thumbnailUrlFormatter(pkg.ThumbnailImage) ?? placeholderPackage
            }
            alt={pkg.PackageName || 'Holiday package'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = placeholderPackage;
            }}
          />
        </div>

        {/* Content section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Top content */}
          <div className="flex-grow">
            {/* Duration */}
            <p className="text-gray-600 text-sm mb-1">{pkg.Duration}</p>

            {/* Package Name */}
            <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem] leading-tight">
              {pkg.PackageName}
            </h2>

            {/* Price */}
            <p className="text-lg font-bold text-nix-prime mb-2">
              ₹ {pkg.StartingPrice}
            </p>

            {/* Amenities icons */}
            <div className="flex justify-between items-center mb-4">
              {miniInclusions.map((mi, idx) => {
                const Icon = getMiniInclusionIcon(mi);
                return Icon ? (
                  <div key={idx} className="flex flex-col items-center">
                    <img src={Icon} alt={mi} className="w-7 h-7" />
                    <span className="text-xs mt-1">{mi}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Get Quote button */}
          <button 
            onClick={(e) => handleGetQuote(e, pkg)}
            className="bg-nix-prime text-white text-base font-medium py-2 rounded-full hover:bg-nix-prime-hover transition-all w-full mt-auto"
          >
            Get Quote
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center text-nix-prime flex flex-col items-center">
          <p className="text-xl font-semibold mb-2">Loading...</p>
          <LucideLoader className="animate-spin size-10" />
        </div>
      </div>
    );
  }

  return (
    <section className="w-full h-fit bg-white py-16">
      <div className="max-w-[90%] mx-auto">
        <h3 className="text-nix-prime text-xl font-semibold text-center mb-2">
          Best Packages
        </h3>
        <h2 className="text-2xl lg:text-4xl text-center text-nix-txt font-extrabold mb-10">
          Handpicked Just for You
        </h2>

        <div className="lg:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ el: '.custom-pagination', clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 1,
              },
              480: {
                slidesPerView: 1.5,
                spaceBetween: 1,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 1,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 1,
              },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full mySwiper px-6 sm:px-8"
          >
            {bestPackages.slice(0, 4).map((pkg) => (
              <SwiperSlide className="!h-auto" key={pkg.PackageId}>
                <PackageCard pkg={pkg} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-pagination flex justify-center mt-4"></div>
        </div>

        <div className="hidden lg:grid grid-cols-5 gap-4">
          {bestPackages.slice(0, 5).map((pkg) => (
            <PackageCard key={pkg.PackageId} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPicks;
