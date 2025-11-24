import React, { useRef, useState, useEffect } from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Airline {
  GroupBookingId: number;
  GroupBookingName: string;
  AirlineLogo: string;
  AirlineLogoUrl?: string;
}

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
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${
        arrowType === 'prev' ? 'left-[-20px]' : 'right-[-20px]'
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

const GroupBookingFlights: React.FC = () => {
  const navigate = useNavigate();
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const fetchGroupBookingList = async () => {
      try {
        const response = await axios.get(
          'https://api.nixtour.com/api/Web/GroupBookingList'
        );
        const list = response.data.Data.GroupBookingList;

        const listWithImages = await Promise.all(
          list.map(async (booking: Airline) => {
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

        setAirlines(listWithImages);
      } catch (error) {
        console.error('Error fetching group booking list:', error);
      }
    };

    fetchGroupBookingList();
  }, []);

  const handleAirlineClick = (groupBookingName: string) => {
    const formattedName = encodeURIComponent(
      groupBookingName.replace(/\s+/g, '-').toLowerCase()
    );
    navigate(`/group-booking/${formattedName}`);
  };

  const handlePrevClick = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNextClick = () => {
    sliderRef.current?.slickNext();
  };

  const settings: Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (airlines.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-4 px-3">
      <h2 className="text-2xl font-semibold mb-4">
        Popular Airlines Group Bookings
      </h2>
      <div className="relative">
        <CustomArrow
          arrowType="prev"
          isVisible={currentSlide > 0}
          onClick={handlePrevClick}
        />
        <Slider ref={sliderRef} {...settings}>
          {airlines.map((airline, index) => (
            <div key={index} className="px-2">
              <div
                className="bg-white rounded-[5px] shadow-md border flex flex-col items-center py-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAirlineClick(airline.GroupBookingName)}
              >
                <img
                  src={airline.AirlineLogoUrl}
                  alt={airline.GroupBookingName}
                  className="w-full h-[100px] object-contain mb-4"
                />
                <h3 className="text-sm font-semibold text-center">
                  {airline.GroupBookingName}
                </h3>
              </div>
            </div>
          ))}
        </Slider>
        <CustomArrow
          arrowType="next"
          isVisible={currentSlide < airlines.length - 4}
          onClick={handleNextClick}
        />
      </div>
    </div>
  );
};

export default GroupBookingFlights;
