import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlaneBound from '../../assets/images/plane-window-bound.png';

// Import airline images
import aeroflat from "../../assets/hotels/aeroflot.webp";
import airindia from "../../assets/hotels/airindia.webp";
import emirates from "../../assets/hotels/emirates.webp";
import ethihad from "../../assets/hotels/ethiad.webp";
import gulfair from "../../assets/hotels/gulf air.webp";
import indigo from "../../assets/hotels/inidigo.webp";
import klm from "../../assets/hotels/klm.webp";
import luftansa from "../../assets/hotels/lufthansa.webp";
import singapore from "../../assets/hotels/singapore airlines.webp";
import srilankan from "../../assets/hotels/srilankan.webp";
import thai from "../../assets/hotels/thai.webp";
import uzbekistan from "../../assets/hotels/uzbekistan.webp";

interface ArrowProps {
    onClick?: () => void;
    arrowType: 'prev' | 'next';
    isVisible: boolean;
}

const CustomArrow: React.FC<ArrowProps> = ({
    onClick,
    arrowType,
    isVisible,
}) => {
    if (!isVisible) return null;
    return (
        <button
            className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${arrowType === 'prev' ? 'left-[-20px]' : 'right-[-20px]'
                } bg-white text-black rounded-full shadow-md hover:shadow-lg focus:outline-none p-3`}
            onClick={onClick}
            aria-label={arrowType === 'prev' ? 'Previous Slide' : 'Next Slide'}
        >
            {arrowType === 'prev' ? (
                <ChevronLeft className="text-black" />
            ) : (
                <ChevronRight className="text-black" />
            )}
        </button>
    );
};

// Airline data with images and names
const airlines = [
    { name: "Aeroflot", image: aeroflat },
    { name: "Air India", image: airindia },
    { name: "Emirates", image: emirates },
    { name: "Etihad Airways", image: ethihad },
    { name: "Gulf Air", image: gulfair },
    { name: "IndiGo", image: indigo },
    { name: "KLM", image: klm },
    { name: "Lufthansa", image: luftansa },
    { name: "Singapore Airlines", image: singapore },
    { name: "SriLankan Airlines", image: srilankan },
    { name: "Thai Airways", image: thai },
    { name: "Uzbekistan Airways", image: uzbekistan },
];

const B2BAgentsCarousel: React.FC = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [itemWidth, setItemWidth] = useState(0);
    const [visibleItems, setVisibleItems] = useState(7);
    const navigate = useNavigate();

    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;

            if (width < 500) {
                setVisibleItems(2);
            } else if (width < 680) {
                setVisibleItems(3);
            } else if (width < 720) {
                setVisibleItems(3);
            } else if (width < 1024) {
                setVisibleItems(5);
            } else {
                setVisibleItems(7);
            }

            if (sliderRef.current) {
                const containerWidth = sliderRef.current.clientWidth;
                setItemWidth(containerWidth / visibleItems);

                // Check if content is wider than container
                const isContentWider = sliderRef.current.scrollWidth > sliderRef.current.clientWidth;
                setShowRightArrow(isContentWider);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [visibleItems]);

    useEffect(() => {
        const checkArrows = () => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
                setShowLeftArrow(scrollLeft > 5);
                setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
            }
        };

        // Initial check
        checkArrows();

        // Check after a short delay to ensure content is rendered
        const timer = setTimeout(checkArrows, 100);

        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', checkArrows);
            return () => {
                slider.removeEventListener('scroll', checkArrows);
                clearTimeout(timer);
            };
        }

        return () => clearTimeout(timer);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;

            sliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handlePrevClick = () => scroll('left');
    const handleNextClick = () => scroll('right');

    const handleAirlineClick = (airlineName: string) => {
        const formattedName = encodeURIComponent(
            airlineName.replace(/\s+/g, '-').toLowerCase()
        );

        navigate(`/flights/${formattedName}`);
    };

    return (
        <div className="mx-auto py-4 sm:px-3">
            <h2 className="text-2xl font-semibold mb-4">
                Special Flight Deals
            </h2>
            <div className="relative px-8">
                <CustomArrow
                    arrowType="prev"
                    isVisible={showLeftArrow}
                    onClick={handlePrevClick}
                />
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {airlines.map((airline, index) => (
                        <div
                            key={index}
                            className="px-2 my-2"
                            onClick={() => handleAirlineClick(airline.name)}
                        >
                            <div className="relative aspect-[28/37] w-[180px] rounded-[300px] bg-white shadow-lg overflow-hidden group cursor-pointer flex flex-col items-center justify-center">
                                <img
                                    src={airline.image}
                                    alt={airline.name}
                                    className="absolute inset-0 w-full h-full object-contain object-center bg-white p-8"
                                />
                                <img
                                    src={PlaneBound}
                                    alt="bound"
                                    className="absolute inset-0 w-full h-full top-0 object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <CustomArrow
                    arrowType="next"
                    isVisible={showRightArrow}
                    onClick={handleNextClick}
                />
            </div>
        </div>
    );
};

export default B2BAgentsCarousel; 