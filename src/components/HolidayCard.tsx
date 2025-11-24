import { useNavigate } from 'react-router-dom';
import placeholderPackage from '../assets/images/pkg-1.jpg';
import { createHolidaySlug, getMiniInclusionIcon } from '../../lib/utils';

export default function HolidayCard({ pkg }: { pkg: any }) {
  const navigate = useNavigate();
  const miniInclusions = pkg.Package?.MiniInclusions.split(', ') ?? [];

  const handleNavigateToPackage = (pkg: any, withEnquiry: boolean = false) => {
    // Use PackageName directly as URL slug
    const packageNameSlug = createHolidaySlug(pkg.Package?.PackageName || '');
    const targetUrl = `/holiday/${packageNameSlug}${withEnquiry ? '?enquiry=true' : ''}`;
    navigate(targetUrl);
  };

  const handleCardClick = (pkg: any) => {
    handleNavigateToPackage(pkg, false);
  };

  const handleGetQuote = (e: React.MouseEvent, pkg: any) => {
    e.stopPropagation();
    handleNavigateToPackage(pkg, true);
  };

  const thumbnailUrlFormatter = (thumbnailUrl: string) => {
    if (!thumbnailUrl) return null;
    if (thumbnailUrl.startsWith('img')) {
      return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split('/')[1]}`;
    }
    return `https://api.nixtour.com/api/Image/GetImage/${thumbnailUrl.split('\\')[2] || thumbnailUrl}`;
  };
  return (
    <div
      onClick={() => handleCardClick(pkg)}
      className="cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm w-full max-w-xs sm:w-64 h-auto sm:h-[440px] flex flex-col mx-auto"
    >
      {/* Image container with fixed height */}
      <div className="w-full h-36 sm:h-40 relative">
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

      {/* Content section with flex grow to fill remaining space */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Top content */}
        <div className="flex-grow">
          {/* Duration */}
          <p className="text-gray-600 text-xs sm:text-sm mb-1">
            {pkg.Package?.Duration}
          </p>

          {/* Package Name - with text truncation */}
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] leading-tight">
            {pkg.Package?.PackageName}
          </h2>

          {/* Price */}
          <p className="text-base sm:text-lg font-bold text-nix-prime mb-2">
            ₹ {pkg.Package?.StartingPrice}
          </p>

          {/* Amenities icons - with better spacing */}
          <div className="flex justify-between items-center mb-4 gap-1 sm:gap-0">
            {miniInclusions.map((mi: string, idx: number) => {
              const Icon = getMiniInclusionIcon(mi);
            
              return Icon ? (
                <div key={idx} className="flex flex-col items-center">
                  <img src={Icon} alt={mi} className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="text-[11px] sm:text-xs mt-1">{mi}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Get Quote Button - positioned at bottom */}
        <button 
          onClick={(e) => handleGetQuote(e, pkg)}
          className="bg-nix-prime text-white text-sm sm:text-base font-medium py-2 rounded-full hover:bg-nix-prime-hover transition-all w-full mt-auto"
        >
          Get Quote
        </button>
      </div>
    </div>
  );
}
