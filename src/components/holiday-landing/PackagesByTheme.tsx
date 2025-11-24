import Car from '../../assets/images/car.png';
import Family from '../../assets/images/family.png';
import Hiking from '../../assets/images/hiking.png';
import Beach from '../../assets/images/beach.png';
import Mountains from '../../assets/images/mountaine.png';
import WorldBackground from '../../assets/images/world-background.png';
import MountainsAndHills from '../../assets/images/mountaine-and-hills.jpg';
import BeachAndIsland from '../../assets/images/beach-and-island.jpg';
import HikingAdventure from '../../assets/images/hiking-adventure.jpg';
import Camping from '../../assets/images/camping.jpg';
import { useEffect, useState } from 'react';
import { LucideLoader } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Autoplay } from 'swiper/modules';
import HolidayCard from '../HolidayCard';



const tabs = [
  { label: 'Honeymoon', icon: Car, id: 'tab1' },
  { label: 'Family & Friends', icon: Family, id: 'tab2' },
  { label: 'Adventure', icon: Hiking, id: 'tab3' },
  { label: 'Beach', icon: Beach, id: 'tab4' },
  { label: 'Mountains', icon: Mountains, id: 'tab5' },
];

interface IThemePackage {
  Package: {
    PackageId: number;
    PackageName: string;
    ThumbnailImage: string;
    StartingPrice: number;
  };
  Category:
  | 'Adventure'
  | 'Honeymoon'
  | 'Family & Friends'
  | 'Beach'
  | 'Mountains';
}

const PackagesByTheme = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [themePackages, setThemePackages] = useState<IThemePackage[]>([]);
  const [activeTab, setActiveTab] = useState('tab1');

  useEffect(() => {
    const fetchBestHolidayPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://api.nixtour.com/api/Web/Holiday'
        );
        if (response.data.Success) {
          setThemePackages(response.data.Data.ThemePackages);
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

    fetchBestHolidayPackages();
  }, []);

  

  const getCategoryLabel = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    return tab?.label || '';
  };

  // Seeded shuffle for consistent randomization per category
  function seededRandom(seed: number): number {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function seededShuffle<T>(array: T[], seed: number): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const categoryLabel = getCategoryLabel(activeTab);
  const categorySeed = categoryLabel
    .split('')
    .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  const filteredPackages = Array.from(
    new Map(
      themePackages
        .filter((pkg) => pkg.Category === categoryLabel)
        .map((pkg) => [pkg.Package.PackageId, pkg] as [number, IThemePackage])
    ).values()
  );

  const consistentRandomPackages = seededShuffle<IThemePackage>(filteredPackages, categorySeed).slice(0, 3);

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

  return (
    <section
      className="w-full py-10 md:py-20"
      style={{
        backgroundImage: `url(${WorldBackground})`,
      }}
    >
      <div className="max-w-[95%] md:max-w-[90%] mx-auto">
        <h3 className="text-nix-prime text-[18px] md:text-[20px] font-semibold text-center">
          Explore the Top
        </h3>
        <h2 className="text-[28px] md:text-[36px] lg:text-[48px] text-nix-txt text-center font-extrabold">
          Packages by Theme
        </h2>

        <div className="w-full">
          <ul className="flex flex-wrap justify-center mt-5 gap-2 md:gap-3">
            {tabs.map((tab) => (
              <li key={tab.id} className="w-[calc(50%-0.5rem)] sm:w-auto relative">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border text-xs md:text-sm lg:text-lg font-semibold transition-all relative
                ${activeTab === tab.id
                      ? 'bg-nix-prime text-white border-nix-prime'
                      : 'bg-[var(--nix-white)] text-[#333] border-nix-prime hover:bg-nix-prime-hover hover:text-white hover:border-nix-prime-hover'
                    }`}
                >
                  <img src={tab.icon} alt="icon" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 md:border-l-8 border-r-6 md:border-r-8 border-t-6 md:border-t-8 border-l-transparent border-r-transparent border-t-nix-prime" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Content */}
          <div className="relative">
            <div className="bg-white mt-6 p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md max-w-[1200px] mx-auto">
              {filteredPackages.length > 0 ? (
                <div className="flex flex-col lg:grid lg:grid-cols-[auto,1fr] w-full gap-4 md:gap-6">
                  {/* Image */}
                  <div className="w-full lg:w-64 flex-shrink-0">
                    <img
                      src={
                        activeTab === 'tab1'
                          ? Camping
                          : activeTab === 'tab2'
                            ? HikingAdventure
                            : activeTab === 'tab3'
                              ? HikingAdventure
                              : activeTab === 'tab4'
                                ? BeachAndIsland
                                : activeTab === 'tab5'
                                  ? MountainsAndHills
                                  : '/placeholder.svg'
                      }
                      alt="Theme"
                      className="rounded-lg md:rounded-xl object-cover w-full h-48 sm:h-64 lg:h-full"
                    />
                  </div>

                  <div className="flex-1">
                                         <div className="block lg:hidden">
                       <Swiper
                         modules={[Autoplay]}
                         slidesPerView={1.2}
                         spaceBetween={12}
                         navigation={false}
                         breakpoints={{
                           320: {
                             slidesPerView: 1.2,
                             spaceBetween: 12,
                           },
                           480: {
                             slidesPerView: 1.4,
                             spaceBetween: 16,
                           },
                           640: {
                             slidesPerView: 1.8,
                             spaceBetween: 16,
                           },
                           768: {
                             slidesPerView: 2.2,
                             spaceBetween: 20,
                           },
                         }}
                         autoplay={{ delay: 3000, disableOnInteraction: false }}
                         className="px-6 sm:px-8"
                       >
                         {consistentRandomPackages
                           .map((pkg: IThemePackage, index: number) => (
                             <SwiperSlide key={index}>
                               <HolidayCard pkg={pkg} />
                             </SwiperSlide>
                           ))}
                       </Swiper>
                     </div>

                    <div className="hidden w-[900px] items-center justify-center lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {consistentRandomPackages.map((pkg: IThemePackage) => (
                        <HolidayCard key={pkg.Package.PackageId} pkg={pkg} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 text-base md:text-lg">
                  No packages found for this category.
                </p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesByTheme;
