import HeroBanner from '../../assets/images/abt-banner.webp'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Target, Telescope } from 'lucide-react'
import Timeline from '../../components/timeline/timeline'
import video from '../../assets/video/video.mp4'
import Nikesh from '../../assets/images/Nikesh.webp'
import Anil from '../../assets/images/Anil .webp'
import Shankha from '../../assets/images/Shankha.webp'
import Zinia from '../../assets/images/Zinia.webp'
import Renu from '../../assets/images/Renu.webp'
import Shashi from '../../assets/images/Shashi.webp'
import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'

function index() {

    const keyPeople = [
        {
            name: "Dr Nikesh Ranjan",
            role: "Founder Chairman",
            image: Nikesh
        },
        {
            name: "Anil Kumar Gupta",
            role: "Director- Study Abroad",
            image: Anil
        },
        {
            name: "Shankha Goswami",
            role: "Marketing",
            image: Shankha
        },
        {
            name: "Zinia Das",
            role: "Human Resources",
            image: Zinia
        },
        {
            name: "Renu Bisht",
            role: "Air Product",
            image: Renu
        },
        {
            name: "Shashikant Yadav",
            role: "Digital Marketing",
            image: Shashi
        }
    ]

    return (
        <div className='min-h-screen'>
            <Navbar />
            <div>
                <img
                    className="sm:object-cover object-contain w-full sm:h-64 md:h-full"
                    src={HeroBanner}
                    alt="hero-banner"
                />
                <div className="bg-[#ffdada] sm:py-6 py-5 px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold">Did you know?</h2>
                    <p className="italic text-sm sm:text-base mt-3 font-medium">
                        70% of our workforce is driven by talented and dedicated women, reflecting
                        our commitment to fostering an inclusive and dynamic work environment
                    </p>
                </div>
            </div>

            <div className="mx-auto px-6 sm:py-16 py-8 lg:px-[112px] md:px-12 sm:px-6">
                <div className="mx-auto">
                    <div className="grid gap-10 lg:grid-cols-2 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl text-[#BC1110]">
                                We are Nixtour
                            </h1>
                            <div className="space-y-4 text-gray-800 text-lg leading-relaxed text-justify">
                                <p>
                                    NixTour is an IATA-accredited travel agency—the one-stop travel solution for all your needs. We are
                                    India&apos;s fastest-emerging online travel website and have a customer-centric approach. We have been
                                    serving the field since 2015. We were incorporated under MCA in 2019, with our Head office in Kolkata,
                                    West Bengal, and Corporate office in New Delhi.
                                </p>

                                <p>
                                    We are experts in offering customers a wide array of seamless and convenient travel solutions. With our
                                    strategically developed services, we have served more than one million passengers to date.
                                </p>
                                <p>
                                    Our well-arranged services include easy and convenient Air tickets, hotels, Insurance, and holiday
                                    package bookings. Our booking Engine processes both online and offline. As the fastest-growing online
                                    travel portal, we ensure quick customer delivery and turnaround time.
                                </p>
                                <p>
                                    We also specialize in special Student Airfares. Each Student is our top priority because we offer them an
                                    extra luggage allowance and discounted airfare up to 15%—20%; however, such offers depend on the
                                    airline&apos;s terms and conditions.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col items-center space-y-6"
                        >
                            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                                <div className="relative max-w-sm aspect-[3/4] overflow-hidden">
                                    <motion.img
                                        src={Nikesh}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <CardContent className="bg-[#BC1110] text-white p-4 text-center">
                                    <h2 className="sm:text-xl text-sm font-bold">Dr Nikesh Ranjan</h2>
                                    <p className="sm:text-sm text-xs font-medium mt-1">Founder Chairman</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

            </div>
            <div className='text-center lg:px-[112px] md:px-12 sm:px-6 px-6 sm:pt-16 pt-8'>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#BC1110]">
                    The Path
                </h1>
                <p className="text-gray-800 text-lg leading-relaxed">
                    Our journey has been full of milestones and achievements. Here are some of the highlights.
                </p>
                <div className='mt-5'>
                    <Timeline />
                </div>
            </div>

            <div className="flex justify-center items-center px-6 py-4 sm:px-4">
                <video
                    src={video}
                    className="w-full max-w-5xl rounded-lg shadow-lg"
                    controls
                    autoPlay
                    loop>
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="mx-auto lg:px-[112px] md:px-12 sm:px-6 px-6 sm:py-16 py-8">
                <div className="grid md:grid-cols-2 sm:gap-10 gap-5 max-w-5xl mx-auto">
                    <Card className="bg-white shadow-lg">
                        <CardHeader className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Mission</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-600 text-lg leading-relaxed">
                            Our mission is to provide travellers and students with ultimate solutions and overall satisfaction, fulfilling their dreams and needs with our expertise and 24x7 Customer-centric support. We believe in making Nix Tour a one-stop shop for offering every travel service and solution available in the industry.
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg">
                        <CardHeader className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Telescope className="w-6 h-6 text-purple-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Vision</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-600 text-lg leading-relaxed">
                            Our vision is to become one of the world&apos;s first-choice Online Travel booking engines, creating value for travellers, students, agents, partners, stakeholders, industry, and society.
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mx-auto lg:px-[112px] md:px-12 sm:px-6 px-6 sm:py-16 py-8">
                <motion.h1
                    className="text-3xl md:text-4xl font-bold tracking-tighter text-[#BC1110] text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Key People
                </motion.h1>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:gap-8 gap-6">
                    {keyPeople.map((person, index) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden max-w-sm transition-all duration-300 hover:shadow-xl">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <motion.img
                                        src={person.image}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <CardContent className="bg-[#BC1110] text-white p-4 text-center">
                                    <h2 className="sm:text-xl text-sm font-bold">{person.name}</h2>
                                    <p className="sm:text-sm text-xs font-medium mt-1">{person.role}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default index