import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import BackgroundImage from '../../assets/images/bg2.png';
import TestimonialVideo from '../../assets/video/testimonial-video.mp4';
import 'swiper/css';


const testimonials = [
  {
    name: "Ava Thompson",
    location: "Japan",
    comment:
      "Kyoto in spring is magical. The cherry blossoms, the peaceful temples, and the culture made it one of my most memorable trips.",
  },
  {
    name: "Noah Patel",
    location: "Italy",
    comment:
      "Rome was like walking through a living museum. The Colosseum, the food, and the history were all absolutely incredible.",
  },
  {
    name: "Isabella Nguyen",
    location: "Vietnam",
    comment:
      "Cruising through Ha Long Bay was breathtaking. The limestone islands and emerald waters felt like a dream.",
  },
  {
    name: "Lucas Smith",
    location: "Australia",
    comment:
      "The Great Barrier Reef is unlike anything I’ve ever seen. Snorkeling there was a life-changing experience.",
  }
];

const Testimonial = () => {
  return (
    <section
      className="py-6 xs:py-8 sm:py-10 md:py-12 bg-cover"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="max-w-[95%] xs:max-w-[90%] md:max-w-[80%] mx-auto px-3 xs:px-4">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-[48px] text-center text-nix-txt font-extrabold mb-6 xs:mb-8">
          Traveler's Tail
        </h2>

        <div className="flex flex-col md:flex-row gap-6 xs:gap-8 md:gap-10 items-center justify-between">
          <div className="w-full md:w-1/2">
            <video
              autoPlay
              loop
              muted
              className="w-full rounded-[8px] xs:rounded-[10px] transition-all duration-500 hover:-translate-y-2"
            >
              <source src={TestimonialVideo} type="video/mp4" />
            </video>
          </div>

          <div className="w-full md:w-1/2 h-48 xs:h-56 sm:h-60 relative">

            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              spaceBetween={20}
              slidesPerView={1}
              className="h-full"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="p-3 xs:p-4 sm:p-6 bg-white shadow-md rounded-[8px] xs:rounded-[10px] h-full flex flex-col justify-center">
                    <h2 className="font-semibold text-lg xs:text-xl sm:text-2xl text-nix-txt">
                      {testimonial.name}
                    </h2>
                    <p className="font-semibold text-nix-prime text-sm xs:text-base">
                      {testimonial.location}
                    </p>
                    <p className="text-nix-txt0 mt-2 text-xs xs:text-sm">
                      {testimonial.comment}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
