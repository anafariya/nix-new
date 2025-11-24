import Footer from "../../components/footer/footer"
import { Navbar } from "../../components/navbar/navbar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ExternalLink, Info, Plane, Users } from "lucide-react"

import axios from 'axios';
import React, { useEffect, useState } from "react"
import DetailsPageFaq from "../../components/DetailsPageFaq/DetailsPageFaq"
import { Helmet } from "react-helmet"
import BookEngine from "../../components/flight-search/book-engine"
import { useParams } from "react-router-dom"
import FlightRoutesList from "../../components/flight-routes/FlightRoutesList"

interface UsefulResource {
    Resource: string;
    Url: string;
}

export default function AirlineDetails() {
    const { airlineName } = useParams();

    const [airlineDetails, setAirlineDetails] = useState<any>(null);
    const [cheapAirline, setCheapAirline] = useState<any>(null);
    const [schedule, setSchedule] = useState<any>(null);
    const [baggageAllowance, setBaggageAllowance] = useState<any>(null);
    const [highestSellingRoutes, setHighestSellingRoutes] = useState<any>(null);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [airlineImage, setAirlineImage] = useState<string>("");
    const [scheduleContent, setScheduleContent] = useState<any[]>([]);
    const [baggageAllowanceContent, setBaggageAllowanceContent] = useState<any[]>([]);
    const [intro, setIntro] = useState<any[]>([]);
    const [information, setInformation] = useState<any[]>([]);
    const [metaTitle, setMetaTitle] = useState<string>("");
    const [metaDescription, setMetaDescription] = useState<string>("");
    const [metaKeywords, setMetaKeywords] = useState<string>("");
    const bookingref = React.createRef<HTMLDivElement>();
    const [address, setAddress] = useState<any[]>([]);
    const [contact, setContact] = useState<any[]>([]);
    const [intAirlineLinks, setIntAirlineLinks] = useState<any[]>([]);
    const [domAirlineLinks, setDomAirlineLinks] = useState<any[]>([]);

    const scrollToBooking = () => {
        bookingref.current?.scrollIntoView({ behavior: 'smooth'});
    };

    // Helper function to generate airline-specific group booking URL
    const generateGroupBookingUrl = (airlineName: string) => {
        if (!airlineName) return '/group-booking';
        
        // Convert airline name to URL-friendly format (same as GroupBookingDetails does)
        const formattedName = encodeURIComponent(
            airlineName.replace(/\s+/g, '-').toLowerCase()
        );
        
        return `/group-booking/${formattedName}`;
    };

    // Navigate to airline-specific group booking page
    const handleGroupBookingClick = () => {
        const groupBookingUrl = generateGroupBookingUrl(airlineDetails?.AirlineName);
        window.location.href = groupBookingUrl;
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchAirlineDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.nixtour.com/api/Web/AirlineDetailsByName?AirlineName=${airlineName}`
                );
                setAirlineDetails(response?.data?.Data);
                setCheapAirline(response?.data?.Data?.CheapFlight[0]?.CheapFlightRouteList);
                setSchedule(response?.data?.Data?.flightSchedule[0]?.FlightScheduleList);
                setBaggageAllowance(response?.data?.Data?.baggageAllowance[0]?.BaggageAllowanceList);
                setHighestSellingRoutes(response?.data?.Data?.highestSellingRoutes?.[0]?.HighestSellingRouteList);
                setScheduleContent(response?.data?.Data?.flightSchedule[0]?.Content);
                setBaggageAllowanceContent(response?.data?.Data?.baggageAllowance[0]?.Content);
                setIntro(response?.data?.Data?.Intro?.[0]?.Content || '');
                setFaqs(response?.data?.Data?.fAQ);
                setInformation(response?.data?.Data?.About?.length > 0 ? response.data.Data.About[0].Content : '');


                setMetaTitle(response?.data?.Data?.Title || "Default Airline Title");
                setMetaDescription(response?.data?.Data?.Description || "Default description for the airline.");
                setMetaKeywords(response?.data?.Data?.Keywords || "airline, flights, travel");
                setAddress(response?.data?.Data?.webCheckIn[0].OfficeAddress);
                setContact(response?.data?.Data?.webCheckIn[0].CSNo);
                setIntAirlineLinks(response?.data?.Data?.IntAirlineLinks || []);
                setDomAirlineLinks(response?.data?.Data?.DomAirlineLinks || []);

                if (response?.data?.Data?.ImageUrl) {
                    fetchAirlineImage(response?.data?.Data?.ImageUrl);
                }
            } catch (error) {
                console.error('Error fetching airline details:', error);
            }
        };

        const fetchAirlineImage = async (imageName: string) => {
            try {
                const imageUrl = `https://api.nixtour.com/api/Image/GetImage/${imageName}`;
                const response = await axios.get(imageUrl, { responseType: "blob" });
                setAirlineImage(URL.createObjectURL(response.data));
                console.log("image", response.data);
            } catch (error) {
                console.error("Error fetching airline image:", error);
            }
        };

        if (airlineName) {
            fetchAirlineDetails();
        }
    }, [airlineName]);

    return (
        <div className="min-h-screen bg-[#ffffff] overflow-x-hidden max-w-full">
            <Helmet>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
            </Helmet>
            <Navbar />
            {/* Blue gradient header section */}
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#2E5C8A] pt-16 sm:pt-24 relative">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between space-x-4 sm:space-x-4">
                        <div className="flex items-center space-x-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white break-words ml-32 mt-10">{airlineDetails?.AirlineName}</h1>
                        </div>
                        
                    </div>
                </div>
                
                {/* Circular logo positioned half outside */}
                <div className="absolute left-8 -bottom-12">
                    <div className="bg-white rounded-full p-4 w-24 h-24 flex items-center justify-center shadow-lg border-4 border-[#4A90E2]">
                        <img src={airlineImage} alt="Airline Logo" className="w-16 h-16 object-contain" />
                    </div>
                </div>
            </div>


            <main className="container mx-auto px-4 sm:px-6 pb-8 pt-16">
                {/* Mobile Group Booking Button - Shows only on mobile */}
                <div className="lg:hidden mb-6">
                    <Button 
                        onClick={handleGroupBookingClick}
                        className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md text-base"
                    >
                        <Users className="h-4 w-4" />
                        Group Booking
                    </Button>
                </div>
                
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_300px]">
                    <div className="space-y-6 sm:space-y-8 min-w-0">
                        <div ref={bookingref}></div>
                        <BookEngine />
                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="flex items-center gap-2 text-black">
                                    <Info className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-base sm:text-[18px] break-words">About <span className="break-words">{airlineDetails?.AirlineName}</span></p>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm leading-relaxed text-[#0f172a]">
                                <p className="text-[#4b5563] text-sm mt-1 break-words text-justify">
                                    {intro || "No information available."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="flex items-center gap-2 text-black">
                                    <Plane className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm sm:text-base break-words">Find Cheap Flights & Ticket Deals on {airlineDetails?.AirlineName}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {cheapAirline?.map((route: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between rounded-lg border border-[#e5e7eb] bg-white p-4 transition-colors hover:bg-[#f9fafb]"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-[#1f2937] text-sm sm:text-base">
                                                    {route?.Route}
                                                </p>
                                                <p className="text-sm text-[#6b7280]">
                                                    Starting From ₹{route?.StartingPrice?.toLocaleString()}
                                                </p>
                                            </div>
                                            <Button 
                                            onClick={scrollToBooking}
                                            className="bg-[#BC1110] font-semibold hover:bg-[#BC1110]/90 text-white rounded w-full sm:w-auto px-4 sm:px-6">
                                                Book Now
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                        </Card>

                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-[#1f2937] text-base sm:text-lg break-words">{airlineDetails?.AirlineName} Information</CardTitle>
                                <p className="text-[#4b5563] text-sm mt-1 break-words text-justify">{information}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { label: "Full Name", value: airlineDetails?.AirlineName },
                                        { label: "Country", value: airlineDetails?.About?.[0]?.CountryName },
                                        { label: "Founded", value: airlineDetails?.About?.[0]?.FoundedDate },
                                        { label: "Base / Main Hub", value: airlineDetails?.About?.[0]?.BaseHub },
                                        { label: "Fleet Size", value: airlineDetails?.About?.[0]?.FleetSize },
                                        { label: "Average Fleet Age", value: airlineDetails?.About?.[0]?.AvgFleetAge },
                                        { label: "Official Site", value: airlineDetails?.About?.[0]?.Website },
                                        { label: "Address", value: address },
                                        { label: "Contact", value: contact },
                                    ].map((item) => (
                                        <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-[#e5e7eb] last:border-b-0">
                                            <dt className="font-medium text-[#1f2937] mb-1 sm:mb-0 sm:w-1/3">{item.label}</dt>
                                            <dd className="text-[#4b5563] break-words sm:w-2/3 sm:text-right text-justify">{item.value}</dd>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>



                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-[#1f2937] text-base sm:text-lg break-words">{airlineDetails?.AirlineName} Flight Schedule</CardTitle>
                                <p className="text-[#4b5563] text-sm mt-1 break-words text-justify">{scheduleContent}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {schedule &&
                                        schedule.map((flight: any, index: number) => (
                                            <div key={index}>
                                                <h3 className="mb-4 text-lg font-semibold text-[#BC1110] flex items-center gap-2 before:content-[''] before:w-1 before:h-4 before:bg-[#8B0000] before:rounded">
                                                    {flight.Route}
                                                </h3>
                                                <div className="bg-white rounded-lg border border-[#e5e7eb] p-4 space-y-3">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Route</span>
                                                            <p className="text-[#334155] font-medium">{flight?.Route}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Flight Name</span>
                                                            <p className="text-[#334155]">{flight?.FlightName || "Unknown"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#f3f4f6]">
                                                        <div>
                                                            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Departure</span>
                                                            <p className="text-[#334155] font-mono text-sm">{flight?.DepartureTime}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Arrival</span>
                                                            <p className="text-[#334155] font-mono text-sm">{flight?.ArrivalTime}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Duration</span>
                                                            <p className="text-[#334155] font-mono text-sm">{flight?.TotDuration}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Baggage Allowance Section */}
                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-[#1f2937] text-base sm:text-lg break-words">{airlineDetails?.AirlineName} baggage allowance</CardTitle>
                                <p className="text-[#4b5563] text-sm mt-1 break-words text-justify">{baggageAllowanceContent}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Economy Class */}
                                    {baggageAllowance?.some((item: any) => item.Airlineclass === "Economy") && (
                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-[#8B0000] flex items-center gap-2 before:content-[''] before:w-1 before:h-4 before:bg-[#8B0000] before:rounded">
                                                Economy Class
                                            </h3>

                                            <div className="space-y-4">
                                                {baggageAllowance
                                                    ?.filter((item: any) => item.Airlineclass === "Economy")
                                                    .map((item: any, index: number) => (
                                                        <div key={index} className="bg-white rounded-lg border border-[#e5e7eb] p-4 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-[#BC1110] bg-[#BC1110]/10 px-2 py-1 rounded">Economy</span>
                                                                <span className="text-sm font-medium text-[#1e293b]">{item.FareType}</span>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                <div>
                                                                    <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Weight</span>
                                                                    <p className="text-[#334155] font-medium">{item.Luggage}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Add-on</span>
                                                                    <p className="text-[#334155]">{item.Addons}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Change Policy</span>
                                                                    <p className="text-[#334155]">{item.ChangePolicy}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Business Class */}
                                    {baggageAllowance?.some((item: any) => item.Airlineclass === "Business") && (
                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-[#8B0000] flex items-center gap-2 before:content-[''] before:w-1 before:h-4 before:bg-[#8B0000] before:rounded">
                                                Business Class
                                            </h3>
                                            <div className="space-y-4">
                                                {baggageAllowance
                                                    ?.filter((item: any) => item.Airlineclass === "Business")
                                                    .map((item: any, index: number) => (
                                                        <div key={index} className="bg-white rounded-lg border border-[#e5e7eb] p-4 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-[#8B0000] bg-[#8B0000]/10 px-2 py-1 rounded">Business</span>
                                                                <span className="text-sm font-medium text-[#1e293b]">{item.FareType}</span>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                <div>
                                                                    <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Weight</span>
                                                                    <p className="text-[#334155] font-medium">{item.Luggage}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Add-on</span>
                                                                    <p className="text-[#334155]">{item.Addons}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Change Policy</span>
                                                                    <p className="text-[#334155]">{item.ChangePolicy}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                        </Card>

                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-[#1f2937] text-base sm:text-lg break-words">{airlineDetails?.AirlineName} Fleet Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-[#6b7280] text-justify">
                                        {airlineDetails?.fleet[0]?.Content || "No fleet information available."}
                                    </p>
                                    <p className="text-sm font-medium text-[#1f2937]">Total Fleet Size: {airlineDetails?.fleet[0]?.TotalFleetSize}</p>
                                    <div className="space-y-3">
                                        {airlineDetails?.fleet?.[0]?.FleetList?.map((item: any, index: any) => (
                                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-[#e5e7eb] hover:bg-[#f8fafc] transition-colors">
                                                <span className="text-[#334155] font-medium">{item?.AircraftTypeName}</span>
                                                <span className="text-[#334155] font-semibold">{item?.Total}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center py-3 px-4 bg-[#BC1110]/5 rounded-lg border-2 border-[#BC1110]/20">
                                            <span className="font-semibold text-[#BC1110]">Total Fleet Size</span>
                                            <span className="font-bold text-[#BC1110] text-lg">
                                                {airlineDetails?.fleet?.[0]?.FleetList?.reduce((total: any, item: any) => total + item?.Total, 0)}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="flex items-center gap-2 text-black">
                                    <Plane className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm sm:text-base break-words">{airlineDetails?.AirlineName} Highest Selling Routes</span>
                                </CardTitle>
                                <p className="text-sm text-[#6b7280] text-justify">
                                    {airlineDetails?.highestSellingRoutes[0]?.Content || "Highest Selling Routes content not available."}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {highestSellingRoutes && highestSellingRoutes.length > 0 ? (
                                        highestSellingRoutes.map((route: { Route: string; StartingPrice: number }, index: number) => {
                                            const [from, to] = route.Route.split(" To "); // Splitting route string
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between rounded-lg border border-[#e5e7eb] bg-white p-4 transition-colors hover:bg-[#f9fafb]"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-[#1f2937] text-sm sm:text-base">
                                                            {from} To {to}
                                                        </p>
                                                        <p className="text-sm text-[#6b7280]">Starting From ₹{route.StartingPrice.toLocaleString()}</p>
                                                    </div>
                                                    <Button onClick={scrollToBooking} className="bg-[#BC1110] font-semibold hover:bg-[#BC1110]/90 text-white rounded w-full sm:w-auto px-4 sm:px-6">Book Now</Button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-gray-500">No highest selling routes available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <DetailsPageFaq

                            faqs={faqs}

                        />

                    </div>

                    <div className="space-y-4 sm:space-y-6 min-w-0">
                        {/* Group Booking Button */}
                        <div>
                            <Button 
                                onClick={handleGroupBookingClick}
                                className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white font-bold py-5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-md text-lg"
                            >
                                <Users className="h-5 w-5" />
                                Group Booking
                            </Button>
                        </div>

                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-base sm:text-lg text-[#1f2937] break-words">Useful Resources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <nav className="flex flex-col space-y-1">
                                    {airlineDetails?.usefulResource?.map((item: UsefulResource) => (
                                        <a
                                            key={item.Resource}
                                            href={item.Url}
                                            className="flex items-center gap-2 text-sm text-[#2563eb] hover:underline"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            {item.Resource}
                                        </a>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>



                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-base sm:text-lg text-[#1f2937] break-words">Popular International Airlines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {intAirlineLinks && intAirlineLinks.length > 0 ? (
                                        intAirlineLinks.map((airline, index) => (
                                            <a
                                                key={index}
                                                href={airline.Url}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <img
                                                    src={`https://api.nixtour.com/api/Image/GetImage/${airline.Logo}`}
                                                    alt={airline.Airline}
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                                <span className="text-sm sm:text-base font-semibold text-[#4b5563] hover:text-[#BC1110] transition-colors">
                                                    {airline.Airline}
                                                </span>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No international airlines available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#e5e7eb] p-1">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-base sm:text-lg text-[#1f2937] break-words">Popular Domestic Airlines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {domAirlineLinks && domAirlineLinks.length > 0 ? (
                                        domAirlineLinks.map((airline, index) => (
                                            <a
                                                key={index}
                                                href={airline.Url}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <img
                                                    src={`https://api.nixtour.com/api/Image/GetImage/${airline.Logo}`}
                                                    alt={airline.Airline}
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                                <span className="text-sm sm:text-base font-semibold text-[#4b5563] hover:text-[#BC1110] transition-colors">
                                                    {airline.Airline}
                                                </span>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No domestic airlines available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main >
            {/* Flight Routes List - displayed above footer */}
            <div className="mt-8 mb-6">
                <FlightRoutesList
                    airlineId={airlineDetails?.AirlineId}
                    className="container mx-auto px-4 sm:px-6"
                />
            </div>
            <Footer />
        </div >
    )
}

