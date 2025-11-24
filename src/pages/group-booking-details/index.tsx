import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Navbar } from '../../components/navbar/navbar';
import TravelForm from '../../components/travel-form/travel-form';
import Footer from '../../components/footer/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

interface IGroupBookingDetails {
  Title: string;
  Description: string;
  Keywords: string;
  GroupBookingId: number;
  GroupBookingName: string;
  AirlineId: number;
  About: string;
  BannerImg: string;
  SessionId: string;
  CreateId: number;
  groupBookingContentModels: Array<{
    Header: string;
    Details: string;
  }>;
  faqModels: Array<{
    Answer: string;
    Question: string;
  }>;
}

interface GroupBookingList {
  GroupBookingId: number;
  GroupBookingName: string;
  AirlineLogo: string;
  AirlineLogoUrl?: string;
}

export default function GroupBookingDetails() {
  const { groupBookingName } = useParams();
  const [groupBookingDetails, setGroupBookingDetails] =
    useState<IGroupBookingDetails | null>(null);
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [metaKeywords, setMetaKeywords] = useState<string>('');
  const [bannerImage, setBannerImage] = useState<string>('');
  const [groupBookingList, setGroupBookingList] = useState<GroupBookingList[]>(
    []
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();
  console.log(groupBookingDetails);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchGroupBookingDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.nixtour.com/api/Web/GroupBookingDetailsByName?GroupBookingName=${groupBookingName}`
        );
        console.log(response.data);
        setMetaTitle(response?.data?.Data?.Title);
        setMetaDescription(response?.data?.Data?.Description);
        setMetaKeywords(response?.data?.Data?.Keywords);
        setGroupBookingDetails(response.data.Data.groupBookingModel);
        if (response?.data?.Data?.groupBookingModel?.BannerImg) {
          fetchBannerImage(response?.data?.Data?.groupBookingModel?.BannerImg);
        }
      } catch (error) {
        console.error('Error fetching group booking details:', error);
      }
    };

    const fetchGroupBookingList = async () => {
      try {
        const response = await axios.get(
          'https://api.nixtour.com/api/Web/GroupBookingList'
        );
        const list = response.data.Data.GroupBookingList;

        const listWithImages = await Promise.all(
          list.map(async (booking: GroupBookingList) => {
            try {
              const imageUrl = `https://api.nixtour.com/api/Image/GetImage/${booking.AirlineLogo}`;
              const imageResponse = await axios.get(imageUrl, {
                responseType: 'blob',
              });
              const logoUrl = URL.createObjectURL(imageResponse.data);
              return { ...booking, AirlineLogoUrl: logoUrl };
            } catch (error) {
              console.error(
                `Error fetching image for ${booking.GroupBookingName}`,
                error
              );
              return { ...booking, AirlineLogoUrl: '' };
            }
          })
        );

        setGroupBookingList(listWithImages);
      } catch (error) {
        console.error('Error fetching group booking list:', error);
      }
    };

    const fetchBannerImage = async (imageName: string) => {
      try {
        const imageUrl = `https://api.nixtour.com/api/Image/GetImage/${imageName}`;
        const response = await axios.get(imageUrl, { responseType: 'blob' });
        setBannerImage(URL.createObjectURL(response.data));
        console.log('image', response.data);
      } catch (error) {
        console.error('Error fetching banner image:', error);
      }
    };

    if (groupBookingName) {
      fetchGroupBookingDetails();
      fetchGroupBookingList();
    }

    // Auto-open modal after 10 seconds
    const timer = setTimeout(() => {
      setShowBookingModal(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [groupBookingName]);

  const handleGroupBookingClick = (groupBookingName: string) => {
    const formattedName = encodeURIComponent(
      groupBookingName.replace(/\s+/g, '-').toLowerCase()
    );

    navigate(`/group-booking/${formattedName}`);
  };

  // Helper to format airline name from URL param
  function formatAirlineName(slug?: string) {
    if (!slug) return '';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!groupBookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] shadow-lg">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <script src="https://assets.makeforms.io/bundles/scripts/live/in/embed.js"></script>
      </Helmet>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-10 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <img
            className="w-full h-40 md:h-52 sm:object-cover rounded-md"
            src={bannerImage}
            alt={groupBookingDetails.GroupBookingName}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {groupBookingDetails.GroupBookingName}
        </h1>

        <div
          dangerouslySetInnerHTML={{ __html: groupBookingDetails.About }}
          className="text-sm text-gray-700 leading-relaxed mb-6 text-justify"
        />

        {/* Dynamic Content Section */}
        <div className="space-y-8">
          {groupBookingDetails.groupBookingContentModels?.map(
            (content, index) =>
              content.Header.toLowerCase().startsWith('Why Choose NixTour') ? (
                <div key={index} className="text-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        img: '/one-stop_travel_solution.webp',
                        title: 'One-Stop Travel Solution',
                        desc: `NixTour offers a wide range of travel solutions...`,
                      },
                      {
                        img: '/simplified_booking_procedure.webp',
                        title: 'Simplified Booking Procedure',
                        desc: `Making an Aeroflot group booking with NixTour offers a convenient procedure...`,
                      },
                      {
                        img: '/affordable_deals.webp',
                        title: 'Affordable Deals',
                        desc: `Opting for Aeroflot group booking with NixTour offers the most affordable deals...`,
                      },
                      {
                        img: '/great_assistance_support.webp',
                        title: 'Great Assistance & Support',
                        desc: `One key advantage of booking an Aeroflot flight for a group with NixTour...`,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center"
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="h-16 w-16 my-4"
                        />
                        <h3 className="text-base font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-700 text-justify">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={index} className="space-y-2">
                  <h2 className="text-lg md:text-xl font-semibold">
                    {content.Header}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: content.Details }}
                    className="prose prose-custom text-xs md:text-sm text-gray-700 max-w-none text-justify"
                  />
                </div>
              )
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            {groupBookingDetails.faqModels?.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b"
              >
                <AccordionTrigger className="text-base md:text-lg font-normal hover:no-underline text-left">
                  {item.Question}
                </AccordionTrigger>
                <AccordionContent  className="text-gray-700">
                  {item.Answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Group Booking List */}
        <div className="mt-10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Choose From Popular Airlines For Group Bookings!
            </h2>
            <Link
              to="/group-booking"
              className="text-blue-600 text-sm font-medium"
            >
              View All &rsaquo;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {groupBookingList?.slice(0, 12).map((booking) => (
              <div
                key={booking.GroupBookingId}
                onClick={() =>
                  handleGroupBookingClick(booking.GroupBookingName)
                }
                className="border border-gray-300 rounded-xl cursor-pointer shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
              >
                <img
                  src={booking.AirlineLogoUrl}
                  alt={booking.GroupBookingName}
                  className="h-16 mb-2 object-contain"
                />
                <p className="text-sm md:text-base font-medium text-center">
                  {booking.GroupBookingName}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-white px-6 py-2 rounded-[10px] text-sm font-medium"
            >
              Contact Nixtour for all your group airline booking
            </button>
          </div>

         
        </div>
      </div>
      <Footer />
      {/* Group Booking Modal */}
      {showBookingModal && (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-3xl">
            <TravelForm
              isModal={true}
              setShowBookingModal={setShowBookingModal}
              airlineName={formatAirlineName(groupBookingName)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
