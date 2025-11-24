import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import { Helmet } from 'react-helmet';

interface OfferDetail {
  Services: string;
  MinBookingAmt: number;
  Offers: string;
}

interface OfferDetails {
  Title: string;
  Description: string;
  Keywords: string;
  BannerUrl: string;
  OfferTitle: string;
  OfferValidity: string;
  TravelValidity: string;
  DiscountDesc: string;
  CancellationPolicy: string;
  TermsConditions: string;
  OfferWebDetails: OfferDetail[];
  CanonicalTag: string;
  CmdMessage: string;
  CmdStatus: number;
  URL: string;
}

const convertHTMLToBulletPoints = (htmlContent: string) => {
  const textWithBreaks = htmlContent
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|li|ul|ol)>/gi, '\n');

  const cleanText = textWithBreaks.replace(/<[^>]*>/g, '');

  // Split only on newline or period followed by a space or end of string
  const points = cleanText
    .split(/(?:\.\s+|\n)/)
    .map((point) => point.trim())
    .filter((point) => point.length > 0);

  return points;
};

const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .trim();
};

export default function OfferDetails() {
  const { offerId } = useParams();
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOfferDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Always get the offers list first to find the matching offer by title slug
        const offersResponse = await axios.get('https://api.nixtour.com/api/Web/OfferList');
       
        if (!offersResponse.data.Success || !offersResponse.data.Data.OfferList) {
          setError('Failed to load offers');
          return;
        }
        
        const offers = offersResponse.data.Data.OfferList;
       
        offers.forEach((offer: any, index: number) => {
          const generatedSlug = createSlugFromTitle(offer.OfferTitle);
          console.log(`Offer ${index + 1}:`, {
            title: offer.OfferTitle,
            generatedSlug: generatedSlug,
            matches: generatedSlug === offerId,
            offerId: offer.OfferId
          });
        });
        
        const matchingOffer = offers.find((offer: any) => 
          createSlugFromTitle(offer.OfferTitle) === offerId
        );
                
        if (!matchingOffer) {
          setError('Offer not found');
          return;
        }
        
        // Now fetch the offer details using the numeric ID
        const response = await axios.get(
          `https://api.nixtour.com/api/Web/OfferDetails?offerId=${matchingOffer.OfferId}`
        );    
        if (response.data.Success && response.data.Data) {
          setOfferDetails(response.data.Data);
        } else {
          setError('Failed to fetch offer details');
        }
      } catch (error) {
        console.error('Error fetching offer details:', error);
        setError('Failed to fetch offer details');
      } finally {
        setLoading(false);
      }
    };

    if (offerId) {
      fetchOfferDetails();
    }
  }, [offerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#BC1110] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg text-gray-600">Loading offer details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !offerDetails) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="text-6xl text-red-200">⚠</div>
            <div className="text-lg text-red-600">{error || 'Offer not found'}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  console.log(offerDetails)

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{offerDetails.Title}</title>
        <meta name="description" content={offerDetails.Description} />
        <meta name="keywords" content={offerDetails.Keywords} />
        {offerDetails.CanonicalTag && <link rel="canonical" href={offerDetails.CanonicalTag} />}
      </Helmet>
      <Navbar />

      {/* Banner Section */}
      <div className="relative h-[130px] sm:h-[300px] md:h-[400px] w-full overflow-hidden">
        <img
          src={`https://api.nixtour.com/api/Image/GetImage/${offerDetails.BannerUrl.split('\\')[2] || offerDetails.BannerUrl}`}
          alt={offerDetails.OfferTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Banner image failed to load:', offerDetails.BannerUrl);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8">
          
          {/* Offer Title */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
              {offerDetails.OfferTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {offerDetails.Description}
            </p>
          </div>

          {/* Validity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Offer Validity */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-[10px] p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-2">Offer Validity</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">{offerDetails.OfferValidity}</div>
            </div>

            {/* Travel Validity */}
            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-[10px] p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-2">Travel Validity</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">{offerDetails.TravelValidity}</div>
            </div>
          </div>

          {/* Offer Details */}
          {offerDetails.OfferWebDetails && offerDetails.OfferWebDetails.length > 0 && (
            <div className="bg-gray-50 rounded-lg sm:rounded-[10px] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Offer Details</h2>
              <div className="space-y-4">
                {offerDetails.OfferWebDetails.map((detail, index) => (
                  <div key={index} className="bg-white rounded-lg sm:rounded-[10px] p-4 border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <div className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Service</div>
                        <div className="text-gray-800 text-sm sm:text-base">{detail.Services}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Minimum Booking Amount</div>
                        <div className="text-gray-800 text-sm sm:text-base">₹{detail.MinBookingAmt.toLocaleString()}</div>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <div className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Offer</div>
                        <div className="text-gray-800 text-sm sm:text-base">{detail.Offers || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discount Description */}
          {offerDetails.DiscountDesc && (
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-[10px] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">How to get the offer</h2>
              <ul className="space-y-3">
                {convertHTMLToBulletPoints(offerDetails.DiscountDesc).map(
                  (point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
                    >
                      <div className="w-2 h-2 bg-[#BC1110] rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Cancellation Policy */}
          {offerDetails.CancellationPolicy && (
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-[10px] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Cancellation Policy</h2>
              <ul className="space-y-3">
                {convertHTMLToBulletPoints(offerDetails.CancellationPolicy).map(
                  (point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
                    >
                      <div className="w-2 h-2 bg-[#BC1110] rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Terms & Conditions */}
          {offerDetails.TermsConditions && (
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-[10px] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
              <ul className="space-y-3">
                {convertHTMLToBulletPoints(offerDetails.TermsConditions).map(
                  (point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
                    >
                      <div className="w-2 h-2 bg-[#BC1110] rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}