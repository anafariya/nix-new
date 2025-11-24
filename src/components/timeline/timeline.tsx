"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Timeline() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const timelineData = [
        {
            year: "2019",
            color: "#C1553B",
            topText: "Nixtour India Pvt Ltd was incorporated under MCA, and www.nixtour.com was launched & got IATA Accrediation",
            bottomText: "",
        },
        {
            year: "2020",
            color: "#2CB9A8",
            topText: "",
            bottomText: "Top Airline Performance Ukraine International Airways",
        },
        {
            year: "2021",
            color: "#973C9C",
            topText: "During the COVID-19 Pandemic, Nixtour was the only company to operate more than 150 Charter flights in association with the Ministry of External Affairs. We successfully Operated Aircraft such as Boeing 777, Airbus A320/321, Boeing 767 & Boeing 757",
            bottomText: "",
        },
        {
            year: "2024",
            color: "#FFCC00",
            topText: "",
            bottomText: "We became the First OTA to Integrate NDC for Aeroflot and we also shifts our existing Technology partner to India Leading Travel Technology Company - Quadlabs",
        },
    ]

    return (
        <div className="w-full p-4 md:p-8 lg:p-12 bg-white">
            <div className="relative">
                {/* Main line (horizontal for desktop, vertical for mobile) */}
                <div className={`absolute ${isMobile ? 'hidden' : 'top-1/2 left-0 w-full h-0.5 -translate-y-1/2'} bg-gray-200`} />

                <div className={`relative flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-center gap-8 md:gap-4`}>
                    {timelineData.map((item, index) => (
                        <div key={item.year} className={`${isMobile ? 'w-full' : 'flex-1'}`}>
                            <div className={`relative flex ${isMobile ? 'flex-row items-start' : 'flex-col items-center'}`}>
                                {/* Top Text */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className={`${isMobile ? 'hidden' : 'min-h-[120px] mb-4'} text-center w-full`}
                                >
                                    <p className="text-sm md:text-base text-justify font-medium">{item.topText}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                    className={`relative ${isMobile ? 'mr-4' : ''}`}
                                >
                                    {!isMobile && item.topText && (
                                        <div className="absolute bottom-full left-1/2 w-px h-4 bg-dotted"
                                            style={{
                                                background: `repeating-linear-gradient(to bottom, ${item.color} 0%, ${item.color} 50%, transparent 50%, transparent 100%)`,
                                                backgroundSize: '2px 8px'
                                            }}
                                        />
                                    )}

                                    <div
                                        className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-lg lg:text-xl relative z-10"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.year}
                                    </div>

                                    {/* Vertical dotted line bottom */}
                                    {!isMobile && item.bottomText && (
                                        <div className="absolute top-full left-1/2 w-px h-4 bg-dotted"
                                            style={{
                                                background: `repeating-linear-gradient(to bottom, ${item.color} 0%, ${item.color} 50%, transparent 50%, transparent 100%)`,
                                                backgroundSize: '2px 8px'
                                            }}
                                        />
                                    )}
                                </motion.div>

                                {/* Bottom Text */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className={`${isMobile ? 'flex-1' : 'min-h-[120px] mt-4'} text-center w-full`}
                                >
                                    <p className="text-sm md:text-base text-start font-medium">{isMobile ? item.topText || item.bottomText : item.bottomText}</p>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

