import axios from 'axios';
import { LucideLoader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';

import 'swiper/css/pagination';
import HolidayCard from '../HolidayCard';

interface IVisaPackage {
  Package: {
    PackageId: number;
    PackageName: string;
    ThumbnailImage: string;
    StartingPrice: number;
  };
  VisaStatusName: 'E-Visa' | 'Visa Free' | 'Visa on Arrival' | 'Sticker Visa';
}



const VisaGateway = () => {
  const [activeTab, setActiveTab] = useState('Visa Free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visaPackages, setVisaPackages] = useState<IVisaPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<IVisaPackage[]>([]);

  useEffect(() => {
    const fetchVisaPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://api.nixtour.com/api/Web/Holiday'
        );
        if (response.data.Success) {
          setVisaPackages(response.data.Data.VisaPackages);
        } else {
          setError('Failed to fetch packages.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load packages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisaPackages();
  }, []);

  const filterPackages = () => {
    setFilteredPackages(
      visaPackages.filter((p) => p.VisaStatusName === activeTab)
    );
  };

  useEffect(() => {
    if (visaPackages.length > 0) {
      filterPackages();
    }
  }, [visaPackages, activeTab]);

  if (error) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center text-red-600 text-center">
        <div>
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

  const tabButtonClass = (tab: string) =>
    `text-[15px] lg:text-[17px] font-semibold w-32 h-10 lg:w-40 lg:h-12 rounded-[8px] border transition relative ${activeTab === tab
      ? 'bg-nix-prime text-white border-nix-prime'
      : 'bg-white text-[#333] border-nix-prime hover:bg-nix-prime-hover hover:text-white'
    }`;

  return (
    <section className="py-16 w-full bg-gray-50">
      <div className="max-w-[80%] mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-nix-prime text-[20px] font-semibold text-center">
            Explore the Top
          </h3>
          <h2 className="text-[30px] lg:text-[48px] text-nix-txt text-center font-extrabold">
            Quick Visa Gateways
          </h2>
        </div>

        <div className="tabs w-full">
          <ul className="flex flex-wrap justify-center gap-3 mt-5">
            {['Visa Free', 'Visa on Arrival', 'E-Visa', 'Sticker Visa'].map(
              (tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={tabButtonClass(tab)}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute left-1/2 -bottom-[10px] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-nix-prime" />
                    )}
                  </button>
                </li>
              )
            )}
          </ul>

          <div className="mt-10 relative">
            <Swiper
              modules={[Pagination]}
              pagination={{ el: '.custom-pagination', clickable: true }}
              spaceBetween={40}
              slidesPerView={1}

              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
              className="w-full mySwiper"
            >
              {filteredPackages.slice(0, 4).map((pkg) => (
                <SwiperSlide key={pkg.Package.PackageId} className="">
                  <HolidayCard pkg={pkg} />
                </SwiperSlide>
              ))}
            </Swiper>


            <div className="custom-pagination flex justify-center mt-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaGateway;
