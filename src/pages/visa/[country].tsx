import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../components/navbar/navbar';
import Footer from '../footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import axios from 'axios';
import { Helmet } from 'react-helmet';

interface VisaPriceItem {
  VisaType: string;
  Validity: number; 
  Price: number;
}

interface VisaGroup {
  VisaGroup: string;
  visaPriceList: VisaPriceItem[];
  reqDocs: string;
}

interface FaqModel {
  Question: string;
  Answer: string;
}

interface VisaData {
  CountryName: string;
  About: string;
  BannerImage: string | null;
  visaTypeDetails: VisaGroup[];
  faqModels: FaqModel[];
  Embassy?: string;
  Title?: string;
  Description?: string;
  Keywords?: string;
}

const VisaCountryDetail = () => {
  const [visa, setVisa] = useState<VisaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);
  const { country } = useParams<{ country: string }>();

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    mobile: '',
    visaType: '',
  });
  const [enquiryErrors, setEnquiryErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    visaType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Handle input change
  const handleEnquiryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateEnquiryForm = () => {
    const newErrors = { name: '', email: '', mobile: '', visaType: '' };
    if (!enquiryForm.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(enquiryForm.name)) {
      newErrors.name = 'Name should contain only letters';
    }
    if (!enquiryForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!enquiryForm.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const digits = enquiryForm.mobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
      }
    }
    if (!enquiryForm.visaType) {
      newErrors.visaType = 'Visa type is required';
    }
    setEnquiryErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Submit handler
  const handleVisaEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnquiryForm() || !visa) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    try {
      const payload = {
        Name: enquiryForm.name,
        Mobile: enquiryForm.mobile.replace(/\D/g, ''),
        EmailId: enquiryForm.email,
        Holiday_Adult: 0,
        Holiday_Child: 0,
        Holiday_Infant: 0,
        Holiday_PackageName: '',
        Holiday_Destination: '',
        Visa_VisaTypeId: 0,
        Visa_Destination: visa.CountryName,
        GroupBooking_CompanyName: '',
        GroupBooking_FromLocation: '',
        GroupBooking_ToLocation: '',
        GroupBooking_Airline: '',
        GroupBooking_NoofPassenger: 0,
        GroupBooking_GroupTypeId: 0,
        PageUrl: window.location.href,
        SessionId: '',
        CreateId: 0,
        EnquiryFor: '',
        VisaType: enquiryForm.visaType,
        GroupType: '',
      };
      const response = await axios.post(
        'https://api.nixtour.com/api/Enquiry/submit',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data) {
        setSubmitStatus({ type: 'success', message: 'Your enquiry has been submitted successfully!' });
        setEnquiryForm({ name: '', email: '', mobile: '', visaType: '' });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 2000);
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!country) return;
    const fetchVisaDetails = async () => {
      setLoading(true);
      try {
        // Convert slug back to country name for API call
        const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const url = `https://api.nixtour.com/api/Web/VisaDetailsByCountry?CountryName=${encodeURIComponent(countryName)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.Data) {
          setVisa(data.Data);
        } else {
          setVisa(null);
        }
      } catch (err) {
        setError('Failed to load visa details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVisaDetails();
  }, [country]);

  const getAllVisaTypes = () => {
    if (!visa) return [];
    return visa.visaTypeDetails.flatMap(group => group.visaPriceList);
  };

  // Helper function to truncate HTML content to approximately 500 words
  const truncateHtmlContent = (htmlContent: string, wordLimit: number = 500) => {
    // Remove HTML tags temporarily to count words
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ');
    
    if (words.length <= wordLimit) {
      return { truncated: htmlContent, isTruncated: false };
    }
    
    // Find the position where we need to truncate
    let wordCount = 0;
    let truncatedHtml = '';
    let inTag = false;
    let currentTag = '';
    
    for (let i = 0; i < htmlContent.length; i++) {
      const char = htmlContent[i];
      
      if (char === '<') {
        inTag = true;
        currentTag = char;
        truncatedHtml += char;
        continue;
      }
      
      if (inTag) {
        currentTag += char;
        truncatedHtml += char;
        if (char === '>') {
          inTag = false;
          currentTag = '';
        }
        continue;
      }
      
      // Count words outside of tags
      if (char === ' ' || char === '\n' || char === '\t') {
        if (truncatedHtml && !truncatedHtml.endsWith(' ')) {
          wordCount++;
          if (wordCount >= wordLimit) {
            break;
          }
        }
      }
      
      truncatedHtml += char;
    }
    
    // Close any open tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = truncatedHtml;
    truncatedHtml = tempDiv.innerHTML;
    
    return { truncated: truncatedHtml, isTruncated: true };
  };

  const renderTabContent = () => {
    if (!visa) return null;

    if (activeTab === 'overview') {
      const { truncated, isTruncated } = truncateHtmlContent(visa.About);
      const displayContent = isReadMoreExpanded ? visa.About : truncated;
      

      
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">About {visa.CountryName} Visa</h2>
          <div 
            className="mb-6 text-gray-800 [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:pl-2" 
            dangerouslySetInnerHTML={{ __html: displayContent }} 
          />
          
          {isTruncated && (
            <button
              onClick={() => setIsReadMoreExpanded(!isReadMoreExpanded)}
              className="text-[#BC1110] hover:text-[#BC1110]/80 font-semibold mb-6 transition-colors"
            >
              {isReadMoreExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
          
          {/* Embassy Details Section */}
          {visa.Embassy && visa.Embassy.trim() && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Embassy Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {(() => {
                  // Parse the embassy HTML content properly
                  const embassyCards: Array<{city: string, content: string}> = [];
                  
                  // Split the HTML by <strong> tags to get city sections
                  const sections = visa.Embassy.split(/(?=<strong>)/);
                  
                  sections.forEach(section => {
                    if (section.trim()) {
                      // Extract city name from <strong> tag
                      const cityMatch = section.match(/<strong>([^<]+)<\/strong>/);
                      if (cityMatch) {
                        const cityName = cityMatch[1].replace(/:-$/, '').trim();
                                                 // Remove the <strong> tag and get the remaining content, also remove any ":-" that might follow
                         const content = section.replace(/<strong>[^<]+<\/strong>/, '').replace(/:-/g, '').trim();
                        
                        if (content) {
                          embassyCards.push({
                            city: cityName,
                            content: content
                          });
                        }
                      }
                    }
                  });
                  
                  return embassyCards.map((card, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-base sm:text-lg font-bold text-[#BC1110] mb-3 sm:mb-4 border-b border-gray-100 pb-2">
                        {card.city}
                      </h4>
                                             <div 
                         className="text-xs sm:text-sm leading-relaxed text-gray-700"
                         dangerouslySetInnerHTML={{ __html: card.content }}
                       />
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
          

        </div>
      );
    }

    // Find the selected visa group
    const selectedGroup = visa.visaTypeDetails.find(group => group.VisaGroup === activeTab);
    if (!selectedGroup) return null;

    return (
      <div>
        <h3 className="text-xl font-bold mb-2">Type of {visa.CountryName} {activeTab}</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-left">Visa Type</th>
                <th className="px-4 py-2 border-b text-left">Validity</th>
                <th className="px-4 py-2 border-b text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedGroup.visaPriceList.map((v, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 border-b">{v.VisaType}</td>
                  <td className="px-4 py-2 border-b">{v.Validity}</td>
                  <td className="px-4 py-2 border-b">₹{v.Price}/-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-bold mb-2">Document Required for {visa.CountryName} {activeTab}</h3>
        <div 
          className="mb-6 text-gray-800 [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:pl-2" 
          dangerouslySetInnerHTML={{ __html: selectedGroup.reqDocs }} 
        />
      </div>
    );
  };

  const bannerUrlFormatter = (bannerImage: string | null) => {
    if (!bannerImage) return '';
    if (bannerImage.startsWith('img')) {
      return `https://api.nixtour.com/api/Image/GetImage/${bannerImage.split('/')[1]}`;
    }
    return `https://api.nixtour.com/api/Image/GetImage/${bannerImage.split('\\')[2] || bannerImage}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{visa?.Title || `${visa?.CountryName || country} Visa - Apply Online | NixTour`}</title>
        <meta name="description" content={visa?.Description || `Apply for ${visa?.CountryName || country} visa online with NixTour. Get complete visa information, requirements, and fast processing services.`} />
        <meta name="keywords" content={visa?.Keywords || `${visa?.CountryName || country} visa, visa application, tourist visa, business visa, online visa`} />
        <meta property="og:title" content={visa?.Title || `${visa?.CountryName || country} Visa - Apply Online`} />
        <meta property="og:description" content={visa?.Description || `Apply for ${visa?.CountryName || country} visa online with NixTour. Get complete visa information, requirements, and fast processing services.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        {visa?.BannerImage && (
          <meta property="og:image" content={bannerUrlFormatter(visa.BannerImage)} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={visa?.Title || `${visa?.CountryName || country} Visa - Apply Online`} />
        <meta name="twitter:description" content={visa?.Description || `Apply for ${visa?.CountryName || country} visa online with NixTour. Get complete visa information, requirements, and fast processing services.`} />
        {visa?.BannerImage && (
          <meta name="twitter:image" content={bannerUrlFormatter(visa.BannerImage)} />
        )}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>
      <Navbar />
      <div className="flex-1 container mx-auto pb-8">
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : visa ? (
          <div>
            {/* Banner Section */}
            <div className="relative  rounded-lg overflow-hidden mb-8">
              <img
                src={bannerUrlFormatter(visa.BannerImage)}
                alt={visa.CountryName + ' Visa Banner'}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <h1 className="text-white text-5xl font-bold p-8 pb-10">
                  {visa.CountryName} Visa
                </h1>
              </div>
            </div>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 px-4 sm:px-8 md:px-12 lg:px-20 md:grid-cols-3 gap-8">
              {/* Left/Main Content */}
              <div className="md:col-span-2">
                                 {/* Tab Navigation */}
                 <div className="flex flex-wrap gap-2 mb-6">
                                       <button
                     onClick={() => setActiveTab('overview')}
                     className={`px-4 py-2 font-medium text-sm rounded-full transition-colors ${
                       activeTab === 'overview'
                         ? 'bg-[#BC1110] text-white'
                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                     }`}
                   >
                     Overview
                   </button>
                   {visa?.visaTypeDetails.map((group) => (
                     <button
                       key={group.VisaGroup}
                       onClick={() => setActiveTab(group.VisaGroup)}
                       className={`px-4 py-2 font-medium text-sm rounded-full transition-colors ${
                         activeTab === group.VisaGroup
                           ? 'bg-[#BC1110] text-white'
                           : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                       }`}
                     >
                       {group.VisaGroup}
                     </button>
                   ))}
                 </div>

                {/* Tab Content */}
                {renderTabContent()}

                {/* FAQ Section */}
                {visa?.faqModels && visa.faqModels.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-3xl font-bold mb-6 text-black">Frequently Asked Questions</h2>
                    <VisaDetailFaq faqModels={visa.faqModels} />
                  </div>
                )}
              </div>
              {/* Enquiry Form */}
              <div className="bg-gray-50 rounded-xl p-6 h-fit shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-center">Enquiry Form</h3>
                <form onSubmit={handleVisaEnquirySubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={enquiryForm.name}
                      onChange={handleEnquiryInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${enquiryErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {enquiryErrors.name && <p className="text-red-500 text-xs mt-1">{enquiryErrors.name}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Id</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={enquiryForm.email}
                      onChange={handleEnquiryInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${enquiryErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {enquiryErrors.email && <p className="text-red-500 text-xs mt-1">{enquiryErrors.email}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile No</label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={enquiryForm.mobile}
                      onChange={handleEnquiryInputChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border ${enquiryErrors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-[6px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {enquiryErrors.mobile && <p className="text-red-500 text-xs mt-1">{enquiryErrors.mobile}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination Country</label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      value={visa.CountryName}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none sm:text-sm"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="visa-type-form" className="block text-sm font-medium text-gray-700">Visa Type</label>
                    <select
                      id="visa-type-form"
                      name="visaType"
                      value={enquiryForm.visaType}
                      onChange={handleEnquiryInputChange}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${enquiryErrors.visaType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-[6px]`}
                    >
                      <option value="">Select Visa Type</option>
                      {getAllVisaTypes().map((v, i) => (
                        <option key={i} value={v.VisaType}>{v.VisaType}</option>
                      ))}
                    </select>
                    {enquiryErrors.visaType && <p className="text-red-500 text-xs mt-1">{enquiryErrors.visaType}</p>}
                  </div>
                  {submitStatus.type && (
                    <div className={`p-2 rounded mb-2 text-center ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{submitStatus.message}</div>
                  )}
                                     <button type="submit" className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white font-semibold py-2 rounded-[6px]" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : !loading && !error && !visa ? (
          <div className="flex items-center justify-center min-h-[60vh] w-full">
            <div className="text-center text-gray-700 text-2xl font-bold">
              Sorry, we could not find visa details for this country.
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

function VisaDetailFaq({ faqModels }: { faqModels: FaqModel[] }) {
  return (
    <section className="sm:py-0 py-0 ">
      <div className="mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqModels.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b"
            >
              <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                {faq.Question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600">
                {faq.Answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default VisaCountryDetail;