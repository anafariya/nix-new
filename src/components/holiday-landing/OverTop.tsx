import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import 'swiper/css/pagination';
import DubaiFest from '../../assets/video/Dubai-Fest.mp4';
import NorthenLights from '../../assets/video/northern-lights.mp4';

export default function OverTop() {
  const videos = [NorthenLights, DubaiFest];

  return (
    <section className="w-full h-fit bg-nix-prime-trans py-16">
      <div className="max-w-[80%] mx-auto">
        <h3 className="text-nix-prime text-[20px] font-semibold text-center">
          Under the Radar
        </h3>
        <h2 className="text-[30px] lg:text-[48px] text-nix-txt text-center font-extrabold">
          Over the Top packages
        </h2>

        <Swiper
          modules={[]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          navigation={false}
          breakpoints={{
            480: {
              slidesPerView: 2,
            },
          }}
          className="w-full mt-5"
        >
          {videos.map((videoSrc, i) => (
            <SwiperSlide key={i}>
              <div className="w-full text-center text-[18px] flex justify-center items-center">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full rounded-[10px]"
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
