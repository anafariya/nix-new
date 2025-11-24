import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import B2bAgents from '../../assets/images/b2b.png'
// import previewImage from '../../assets/images/preview.png'
import dealsb2b from '../../assets/images/dealsb2b.png'
import { Users, ShieldCheck, CalendarX2, Send, FileText, Settings } from 'lucide-react'
import B2bFaq from '../../components/accordian/B2bFaq'
import { useEffect, useState } from 'react'
import TopHotels from '../../components/top-hotels/top-hotels'
import Baneer1 from '../../assets/images/b2bbanner1.jpeg'
import Baneer2 from '../../assets/images/b2bbanner2.jpeg'
import B2BAgentsCarousel from '../../components/b2bhotels/b2bhotels'
import { Helmet } from 'react-helmet'




type Props = {}

const features = [
    {
        title: "Unbeatable Rates",
        description: "Special partner-only pricing you won't find anywhere else"
    },
    {
        title: "Priority Support",
        description: "Quick and easy tools to resolve queries with minimal hassle"
    },
    {
        title: "Extensive Inventory",
        description: "Access to 300+ airlines and over 800,000 hotel properties worldwide"
    },
    {
        title: "Guaranteed Confidentiality",
        description: "Your customer information and bookings are kept 100% secure and private"
    }
]

function B2bagents({ }: Props) {

    const [currentSlide, setCurrentSlide] = useState(0);

    const bannerImages = [Baneer1, Baneer2];

    // Fetch airlines on component mount



    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [bannerImages.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    };

    return (
        <>
            <Helmet>
                <title>Best B2B Travel Portal in India | Travel Solutions for Agents</title>
                <meta name="description" content="NixTour is Best B2B travel portal in India, offering unbeatable deals, to provide 24/7 support to travel agents, tour operators and travel distributors with best user-friendly platform." />
                <meta name="keywords" content="B2B travel portal, travel agents India, tour booking, Nix Tour travel, travel API, flight booking B2B, hotel booking portal, travel portal solution, best b2b travel portal, online travel portal, NixTour solution for travel agents, best travel portal in India, NixTour travel website" />
            </Helmet>
            <Navbar />
            <div className="">
                <img src={B2bAgents} className='object-cover' alt="B2bAgents" />
            </div>
            <div className="px-4 sm:px-6 md:px-24 py-6 mx-auto">
                <div className="relative overflow-hidden rounded-[12px]">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {bannerImages.map((image, index) => (
                            <div key={index} className="w-full flex-shrink-0">
                                <img
                                    src={image}
                                    className='w-full h-auto rounded-[12px]'
                                    alt={`Banner ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {bannerImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 px-4 sm:px-6 md:px-24 pt-6 mx-auto gap-8 items-center'>
                <div className='col-span-1'>
                    {/* {/* <img src={previewImage} className='w-full' alt="previewImage" /> */} 
                </div>
                <div className='col-span-1 md:col-span-2 flex flex-col justify-center'>
                    <h1 className='text-2xl md:text-3xl font-bold mb-2'>Why Partner with Nixtour?</h1>
                    <p className='text-base md:text-lg text-gray-600 mb-6'>Join us to discover the smart way to grow your business</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                        {features.map((feature, index) => (
                            <div key={index} className='border rounded-xl p-5 bg-white shadow-sm'>
                                <div className='text-2xl font-bold text-blue-800 mb-1'>{feature.title}</div>
                                <div className='text-gray-600 text-base'>{feature.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='text-base md:text-lg text-gray-800 px-4 sm:px-6 md:px-24'>
                Say hello to NixTour – a powerful Travel Agent Partner platform made just for travel agents. Here, you can find everything your customers need for their travel plans. From booking flights to hotel deals, NixTour helps you handle it all with ease. The platform is easy to use and packed with features that make your job faster and simpler. Plus, you will get access to exciting offers that help you grow your business and keep your clients happy.
            </div>
            <div className="space-y-8 px-4 sm:px-6 md:px-24 py-8">
                <div>
                    <B2BAgentsCarousel />
                </div>
                <div className=''>
                    <TopHotels />
                </div>
            </div>
            <div className='px-4 sm:px-6 md:px-24 py-6 mx-auto'>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Increase your profit by 200% with NixTour</h2>
                <img src={dealsb2b} className='rounded-[12px] border shadow-md object-cover w-full' alt="dealsb2b" />
            </div>
            <div className="px-4 sm:px-6 md:px-24 py-6 mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Why Choose Nix Tour?</h2>
                <p className="text-base md:text-lg text-gray-800 mb-4">Looking for a smart way to grow your travel business? Nix Tours and Travels is your trusted B2B travel agency with everything you need in one place. Our powerful B2B NixTour portal is built exclusively for travel agent partners who want access to the best tools and deals for flight booking, hotel reservations, and holiday packages.<br />
                    Get access to exclusive rates with the best-ever pricing on cheap flight tickets, low-cost airlines, and lowest air fare across 300+ airline carriers. Plus, we offer a vast hotel inventory of over 8 lakh properties, making us the go-to travel agent booking platform for every need.<br />
                    Our online booking system is simple and fast, backed by express care support for quick query resolution. At NixTour, your bookings and customer details stay 100% secure — confidentiality is guaranteed. Whether you're looking to book hotels, flights, or complete holiday packages, our B2B travel portal gives you the edge to succeed.</p>
            </div>
            <div className="px-4 sm:px-6 md:px-24 py-6 mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Advantages of NixTour B2B Travel Booking Platform</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">NixTour's online B2B travel portal is packed with smart features designed for travel agents. You can easily track all flight bookings, payments, and customer records in one place.</p>
                <p className="text-base md:text-lg text-gray-800 mb-2">Make quick changes after booking flights, and enjoy smooth updates with zero hassle. Book safe and hygienic hotels with MySafety-certified properties. Get access to flexible hotel cancellation policies that protect your earnings.</p>
                <p className="text-base md:text-lg text-gray-800">You can even share flight and hotel options directly with your customers on WhatsApp, and print confirmations under your agency's name and logo. With Nix Tour's B2B travel platform, managing bookings has never been easier!</p>
            </div>
            <div className="px-4 sm:px-6 md:px-24 pb-6 mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="flex items-start bg-white border rounded-2xl shadow-sm p-4 md:p-6">
                        <Users className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mr-3 md:mr-4" />
                        <div>
                            <div className="font-bold text-base md:text-lg mb-1">Seamless Access</div>
                            <div className="text-sm md:text-base text-gray-700">Instantly view and manage all booking and payment records</div>
                        </div>
                    </div>
                    <div className="flex items-start bg-white border rounded-2xl shadow-sm p-4 md:p-6">
                        <Settings className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mr-3 md:mr-4" />
                        <div>
                            <div className="font-bold text-base md:text-lg mb-1">Flexible Flight Management</div>
                            <div className="text-sm md:text-base text-gray-700">Effortlessly handle post-booking changes for flight reservations</div>
                        </div>
                    </div>
                    <div className="flex items-start bg-white border rounded-2xl shadow-sm p-4 md:p-6">
                        <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mr-3 md:mr-4" />
                        <div>
                            <div className="font-bold text-base md:text-lg mb-1">Safe & Hygienic Stays</div>
                            <div className="text-sm md:text-base text-gray-700">Book properties that meet MySafety standards for cleanliness and safety</div>
                        </div>
                    </div>
                    <div className="flex items-start bg-white border rounded-2xl shadow-sm p-4 md:p-6">
                        <CalendarX2 className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mr-3 md:mr-4" />
                        <div>
                            <div className="font-bold text-base md:text-lg mb-1">Flexible Hotel Cancellations</div>
                            <div className="text-sm md:text-base text-gray-700">Benefit from industry-leading cancellation policies on hotel bookings</div>
                        </div>
                    </div>
                    <div className="flex items-start bg-white border rounded-2xl shadow-sm p-4 md:p-6">
                        <Send className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mr-3 md:mr-4" />
                        <div>
                            <div className="font-bold text-base md:text-lg mb-1">Direct Sharing</div>
                            <div className="text-sm md:text-base text-gray-700">Share travel options with your clients instantly via WhatsApp</div>
                        </div>
                    </div>
                    <div className="flex items-start bg-white border rounded-2xl shadow-sm p-4 md:p-6">
                        <FileText className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mr-3 md:mr-4" />
                        <div>
                            <div className="font-bold text-base md:text-lg mb-1">Branded Confirmations</div>
                            <div className="text-sm md:text-base text-gray-700">Print booking confirmations featuring your agency's logo for a professional touch</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 sm:px-6 md:px-24 pb-6 mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Flight Booking and Travel Services with Nix Tour – India's Leading B2B Travel Portal</h2>
                <p className="text-base md:text-lg text-gray-800 mb-6">If you are a travel agent looking for cheap flight booking, lowest air fare, or easy online booking, Nix Tours and Travels has it all. As India's leading B2B travel portal, Nix Tour Connect helps agents grow with high margins and simple tools.</p>
                <div className="space-y-6">
                    <div>
                        <span className="font-bold text-[18px]">Flights – Best B2B Portal for Travel Agents</span>
                        <p className="text-gray-800 text-[18px]">With Nix Tour Connect, book one-way or roundtrip flights on top low cost airlines and global carriers. Use sector fares or global (SOTO) fares for international routes and earn more on every deal. It's the best b2b flight ticket booking portal for agents across India.</p>
                    </div>
                    <div>
                        <span className="font-bold text-[18px]">Hotels – Easy Hotel Booking Platform for Travel Agents</span>
                        <p className="text-gray-800 text-[18px]">Access 1 million+ global hotels and 1500+ direct contracts. Search by city, budget, rating, and more. This hotel booking platform for travel agents makes it easy to offer customers the best deals and value.</p>
                    </div>
                    <div>
                        <span className="font-bold text-[18px]">Visa – Fast and Reliable Visa Services</span>
                        <p className="text-gray-800 text-[18px]">Get all visa services under one roof. Apply online for UAE, Thailand, and more. Use AVA centers in major cities for fast processing. Nix Tour is trusted as one of the best visa portals for travel agents.</p>
                    </div>
                    <div>
                        <span className="font-bold text-[18px]">Insurance – Quick Travel Insurance Booking</span>
                        <p className="text-gray-800 text-[18px]">Choose plans for domestic, international, business, student, and senior travel. Get affordable rates with high coverage. Our travel insurance booking portal keeps things simple and secure.</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-2">Travel Partner Benefits with Nix Tour</h3>
                    <p className="text-gray-800 text-lg mb-2">Join as a travel agent partner and enjoy exclusive offers, easy login, and real-time support. Use our b2b Nixtour portal, booking com travel agent platform, and more to boost your earnings. We also support online booking platform for travel agent commission agreement.<br />From cheap flight tickets to hotel and visa booking, Nix Tour is the top b2b travel agency for agents in India. Join the best online b2b travel portal in India and grow your business today.</p>
                    <p className="font-bold text-black text-[18px]">Don't wait—start growing your travel business with NixTour today!</p>
                </div>
            </div>
            <div className="px-4 sm:px-6 md:px-24 pb-6 mx-auto">
                <h2 className="text-2xl md:text-2xl font-bold mb-4 md:mb-6">Steps to Apply with Nix Tour</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">Getting started with Nix Tour is quick and simple. Just follow these easy steps to begin your journey as a travel agent:</p>
                <ol className="list-decimal list-inside text-base md:text-lg text-gray-800 mb-4 space-y-1">
                    <li>Visit the Nix Tour Connect portal and click on "Agent Signup."</li>
                    <li>Enter your mobile number and verify it using the OTP sent to you.</li>
                    <li>Fill in your basic details and upload your PAN card.</li>
                    <li>Upload your KYC documents (business registration, bank statement, or electricity bill).</li>
                    <li>Set your password, accept the terms and conditions, and complete the registration.</li>
                </ol>
                <p className="text-base md:text-lg text-gray-800 mb-8">You're all set to book cheap flight tickets, hotels, visas, and more with India's leading B2B travel portal!</p>
                <h2 className="text-2xl md:text-2xl font-bold mb-4 mt-8">Why travel agents trust Nix Tours:</h2>
                <ul className="list-disc list-inside text-base md:text-lg text-gray-800 space-y-1">
                    <li>Get the lowest air fare and exclusive B2B rates on hotels and flights.</li>
                    <li>Access 300+ airlines and over 8 lakh hotel options worldwide.</li>
                    <li>Use smart tools and quick support with our Express Care feature.</li>
                    <li>Keep your customer details 100% private and secure.</li>
                    <li>All bookings confirmed and printed under your agency's name and logo.</li>
                    <li>Enjoy flexible and agent-friendly hotel cancellation policies.</li>
                </ul>
            </div>
            <div className="px-4 sm:px-6 md:px-24 pb-6 mx-auto">
                <B2bFaq />
            </div>
            <Footer />
        </>
    )
}

export default B2bagents