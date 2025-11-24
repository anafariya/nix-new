import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plane, Building2, MapPin, Shield, FileCheck, Star, Clock, Users, CheckCircle } from 'lucide-react'
import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"

function ServicePage() {
    const services = [
        {
            icon: Plane,
            title: "Flight Bookings",
            description: "Book domestic and international flights at the best prices. NixTour partners with 400+ airlines worldwide to give you unbeatable travel deals."
        },
        {
            icon: Building2,
            title: "Hotel Bookings",
            description: "Choose from over 1 million hotels in India and abroad. From budget stays to luxury resorts, we have options for every traveler."
        },
        {
            icon: MapPin,
            title: "Domestic Holiday Packages",
            description: "Explore India's best tourist spots with our well-designed domestic packages. Enjoy guided tours, meals, and hotel stays included."
        },
        {
            icon: MapPin,
            title: "International Holiday Packages",
            description: "Want to travel abroad? We offer all-inclusive packages to top destinations like Dubai, Singapore, Maldives, and Europe."
        },
        {
            icon: FileCheck,
            title: "Visa Services",
            description: "Get professional visa assistance for all major countries. Our team helps with documentation, appointment scheduling, and tracking."
        },
        {
            icon: Shield,
            title: "Travel Insurance",
            description: "Secure your trip with affordable travel insurance plans. Stay protected from delays, loss, or emergencies during your journey."
        }
    ]

    const whyChooseFeatures = [
        {
            icon: CheckCircle,
            title: "No hidden costs, Transparent Pricing"
        },
        {
            icon: Clock,
            title: "24/7 dedicated customer support"
        },
        {
            icon: Users,
            title: "Strong partnerships with top airlines, hotels, and travel vendors"
        },
        {
            icon: Star,
            title: "Smooth booking for flights, hotels and more"
        },
        {
            icon: CheckCircle,
            title: "Easy online platform with best-in-class travel deals"
        },
        {
            icon: Users,
            title: "Personalised travel experiences with complete transparency"
        }
    ]

    const faqData = [
        {
            question: "What services does NixTour offer?",
            answer: "NixTour offers complete travel services including flight bookings, hotel bookings, domestic and international holiday packages, visa services, travel insurance and more."
        },
        {
            question: "Can I book both domestic and international holiday packages with NixTour?",
            answer: "Yes, NixTour provides customised domestic and international holiday packages with hotels, guided tours, meals, and transport included."
        },
        {
            question: "Does NixTour help with visa applications?",
            answer: "Yes, NixTour offers visa assistance for all major countries. We help with documentation, appointment booking, application tracking, and support until your visa is approved."
        },
        {
            question: "How do I book a flight ticket through NixTour?",
            answer: "You can book domestic or international flight tickets directly on the NixTour platform by selecting your route, date, and airline. Our system will show you the best fares and options available."
        },
        {
            question: "Is there any hidden fee in NixTour services?",
            answer: "No. NixTour follows a zero hidden cost and no convenience fee policy to ensure transparency and trust."
        },
        {
            question: "Does NixTour offer travel insurance?",
            answer: "Yes, NixTour provides affordable travel insurance plans that cover delays, cancellations, lost luggage, and medical emergencies during your trip."
        },
        {
            question: "Can I book hotels through NixTour?",
            answer: "Absolutely! You can choose from over 1 million hotels in India and abroad. NixTour offers everything from budget stays to luxury resorts."
        },
        {
            question: "How reliable is NixTour for travel bookings?",
            answer: "NixTour is one of the most trusted travel service providers in India, known for its customer-first approach, transparent pricing, and 24/7 customer support."
        },
        {
            question: "Does NixTour provide group travel or corporate travel services?",
            answer: "Yes, NixTour offers group bookings and personalized packages for family vacations, student trips, and corporate travel needs."
        },
        {
            question: "Can I reschedule or cancel my bookings?",
            answer: "Yes, rescheduling and cancellations are possible based on the airline or hotel's policy. Our support team is always available to help with modifications."
        }
    ]

    return (
        <div className='min-h-screen'>
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#BC1110] to-[#8B1F1F] text-white py-16">
                <div className="container mx-auto px-6 lg:px-[112px] md:px-12 text-center">
                    <motion.h1 
                        className="text-4xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        NixTour – Your Trusted Travel Partner
                    </motion.h1>
                    <motion.p 
                        className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Looking for reliable travel services in India? NixTour brings you everything you need for a perfect journey, from flight bookings to hotel reservations, visa assistance, and complete holiday packages. Whether you are planning a domestic getaway or an international escape, our expert travel solutions make it simple, fast, and affordable.
                    </motion.p>
                </div>
            </div>

            {/* Why Choose NixTour Section */}
            <div className="py-16 px-6 lg:px-[112px] md:px-12">
                <div className="container mx-auto">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#BC1110] mb-6">Why Choose NixTour?</h2>
                        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                            At NixTour, we go beyond just booking your trip; we offer end-to-end travel services tailored to your needs. We simplify trip planning and booking with easy access to flights, hotels, holiday packages, Visas, Study Abroad, and Travel insurance. Our goal is to give you a hassle-free travel experience with no hidden charges or unnecessary fees.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Our Key Travel Services Section */}
            <div className="bg-gray-50 py-16 px-6 lg:px-[112px] md:px-12">
                <div className="container mx-auto">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-[#BC1110] text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Our Key Travel Services
                    </motion.h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                                            <service.icon className="w-6 h-6 text-[#BC1110]" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-800">{service.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 leading-relaxed">{service.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* What Makes NixTour Different Section */}
            <div className="py-16 px-6 lg:px-[112px] md:px-12">
                <div className="container mx-auto">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-[#BC1110] text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        What Makes NixTour Different?
                    </motion.h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whyChooseFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <feature.icon className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="font-medium text-gray-800">{feature.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* One-Stop Travel Booking Platform Section */}
            <div className="bg-gray-50 py-16 px-6 lg:px-[112px] md:px-12">
                <div className="container mx-auto text-center">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-[#BC1110] mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        One-Stop Travel Booking Platform
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        NixTour is more than just a travel agency. We are a comprehensive travel solution provider in India, offering access to over 10,000 holiday packages, all country visa services, travel insurance, and more. Whether you are planning a weekend trip or an international holiday, we have got you covered.
                    </motion.p>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#BC1110] to-[#8B1F1F] text-white py-16">
                <div className="container mx-auto px-6 lg:px-[112px] md:px-12 text-center">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Start Your Journey with NixTour Today
                    </motion.h2>
                    <motion.p 
                        className="text-lg mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Planning a trip? Let NixTour handle the details. From flight booking and hotel booking to visa services and full holiday packages, we make travel simple. Book now and enjoy a smooth, secure, and budget-friendly travel experience with NixTour Services.
                    </motion.p>
                </div>
            </div>

            {/* FAQ Section */}
            <section className="py-16 px-6 lg:px-[112px] md:px-12">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold mb-8 text-left">
                        Frequently Asked Questions
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b"
                            >
                                <AccordionTrigger className="text-base font-medium hover:no-underline text-left">
                                    Q. {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-gray-600">
                                    <p dangerouslySetInnerHTML={{__html: faq.answer}}></p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default ServicePage