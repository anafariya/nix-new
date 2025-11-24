import { useEffect, useState } from 'react';
import bg1 from '../../assets/images/bg1.png';
import placeholderPackage from '../../assets/images/pkg-1.jpg';
import { LucideLoader } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createHolidaySlug, getMiniInclusionIcon } from '../../../lib/utils';

interface IFitPackage {
  Package: {
    PackageId: number;
    PackageName: string;
    ThumbnailImage: string;
    StartingPrice: number;
    Duration: string;
    MiniInclusions: string;
  };
  Market: 'International' | 'Domestic';
  DurationRange: string;
  PriceRange: string;
}

const daysMap: Record<string, string> = {
  'day-1-3': '1 to 3 Days',
  'day-4-6': '4 to 6 Days',
  'day-7-9': '7 to 9 Days',
  'day-10-12': '10 to 12 Days',
  'day-13-more': '13+ Days',
};

const budgetMap: Record<string, string> = {
  'rs-u-10k': 'Less than 10,000',
  'rs-10k-20k': '10,000 to 20,000',
  'rs-20k-40k': '20,000 to 40,000',
  'rs-40k-60k': '40,000 to 60,000',
  'rs-60k-80k': '60,000 to 80,000',
  'rs-80k-more': 'More than 80,000',
};

const marketMap: Record<string, 'International' | 'Domestic'> = {
  international: 'International',
  domestic: 'Domestic',
};

const PackageFilterSection = () => {
  const [sector, setSector] = useState('domestic');
  const [days, setDays] = useState('day-4-6');
  const [budget, setBudget] = useState('rs-20k-40k');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fitPackages, setFitPackages] = useState<IFitPackage[]>([]);
  const [filteredPackages, setfilteredPackages] = useState<IFitPackage[]>([]);

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
          setFitPackages(response.data.Data.FitPackages);
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

  const filterPackage = () => {
    const selectedMarket = marketMap[sector];
    const selectedDays = daysMap[days];
    const selectedBudget = budgetMap[budget];

    const filtered = fitPackages.filter((pkg) => {
      return (
        pkg.Market === selectedMarket &&
        pkg.DurationRange === selectedDays &&
        pkg.PriceRange === selectedBudget
      );
    });

    setfilteredPackages(filtered);
  };

  const handleNavigateToPackage = (pkgName: string, withEnquiry: boolean = false) => {
    // Use PackageName directly as URL slug
    const slug = createHolidaySlug(pkgName);
    
    // Navigate directly to package without filter slug
    const targetUrl = `/holiday/${slug}${withEnquiry ? '?enquiry=true' : ''}`;
    navigate(targetUrl);
  };

  const handleCardClick = (pkgTitle: string) => {
    handleNavigateToPackage(pkgTitle, false);
  };

  const handleGetQuote = (e: React.MouseEvent, pkgTitle: string) => {
    e.stopPropagation();

    handleNavigateToPackage(pkgTitle, true);
  };

  useEffect(() => {
    filterPackage();
  }, [sector, days, budget, fitPackages]);

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
    <section
      className="bg-cover bg-center bg-no-repeat py-8 md:py-12 lg:py-20"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <div className="w-[90%] md:w-[85%] lg:max-w-[80%] mx-auto">
        <h3 className="text-nix-prime text-base md:text-lg lg:text-[20px] font-semibold text-center">
          Your Trip, Your Rules
        </h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] text-nix-txt text-center font-extrabold mt-2">
          Choose Your Best-Fit Package
        </h2>

        <div className="w-full flex flex-col sm:flex-row gap-3 my-5 items-center justify-center">
          <span className="flex items-center gap-1 text-gray-700 mb-2 sm:mb-0">
            Filters <i className="fa-solid fa-arrow-down-wide-short"></i>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="bg-nix-prime text-white text-base font-medium py-2 pl-4 pr-4 rounded-full hover:bg-nix-prime-hover transition-all w-full mt-auto"
            >
              <option className="bg-nix-white  text-nix-prime" value="domestic">
                Domestic
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="international"
              >
                International
              </option>
            </select>

            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="bg-nix-prime text-white text-base pl-4 pr-4 font-medium py-2 rounded-full hover:bg-nix-prime-hover transition-all w-full mt-auto"
            >
              <option className="bg-nix-white text-nix-prime" value="day-1-3">
                1 to 3 Days
              </option>
              <option className="bg-nix-white text-nix-prime" value="day-4-6">
                4 to 6 Days
              </option>
              <option className="bg-nix-white text-nix-prime" value="day-7-9">
                7 to 9 Days
              </option>
              <option className="bg-nix-white text-nix-prime" value="day-10-12">
                10 to 12 Days
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="day-13-more"
              >
                13+ Days
              </option>
            </select>

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-nix-prime text-white text-base pl-4 pr-4  font-medium py-2 rounded-full hover:bg-nix-prime-hover transition-all w-full mt-auto"
            >
              <option className="bg-nix-white text-nix-prime" value="rs-u-10k">
                Less than ₹10,000
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="rs-10k-20k"
              >
                ₹10,000 to ₹20,000
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="rs-20k-40k"
              >
                ₹20,000 to ₹40,000
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="rs-40k-60k"
              >
                ₹40,000 to ₹60,000
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="rs-60k-80k"
              >
                ₹60,000 to ₹80,000
              </option>
              <option
                className="bg-nix-white text-nix-prime"
                value="rs-80k-more"
              >
                More than ₹80,000
              </option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 pt-2 px-1 scrollbar-thin scrollbar-thumb-primary text-nix-prime">
          {filteredPackages.length === 0 ? (
            <p className="text-center w-full mt-4 text-nix-prime">
              No packages match your filters.
            </p>
          ) : (
            filteredPackages.slice(0, 6).map((pkg) => {
              const miniInclusions =
                pkg.Package?.MiniInclusions?.split(', ') ?? [];
              return (
                <div
                  key={pkg.Package.PackageId}
                  onClick={() => handleCardClick(pkg.Package.PackageName)}
                  className="cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm w-72 h-80 min-h-[360px] pb-8 flex flex-col flex-shrink-0"
                >
                  {/* Image container */}
                  <div className="w-full h-36 relative">
                    <img
                      src={
                        thumbnailUrlFormatter(pkg.Package?.ThumbnailImage) ??
                        placeholderPackage
                      }
                      alt={pkg.Package?.PackageName || 'Holiday package'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = placeholderPackage;
                      }}
                    />
                  </div>

                  {/* Content section */}
                  <div className="p-3 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <p className="text-gray-600 text-xs mb-1">
                        {pkg.Package?.Duration}
                      </p>
                      <h2 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3rem] leading-tight">
                        {pkg.Package?.PackageName}
                      </h2>
                      <p className="text-base font-bold text-nix-prime mb-2">
                        ₹ {pkg.Package?.StartingPrice}
                      </p>

                      {/* Mini inclusions icons */}
                      <div className="flex justify-between items-center mb-2">
                        {miniInclusions.map((mi, idx) => {
                          const Icon = getMiniInclusionIcon(mi);

                          return Icon ? (
                            <div
                              key={idx}
                              className="flex flex-col items-center"
                            >
                              <img src={Icon} alt={mi} className="w-7 h-7" />
                              <span className="text-xs text-gray-900 mt-0.5">
                                {mi}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleGetQuote(e, pkg.Package.PackageName)}
                      className="bg-nix-prime text-white text-base font-medium py-2 rounded-full hover:bg-nix-prime-hover transition-all w-full mt-auto"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default PackageFilterSection;
