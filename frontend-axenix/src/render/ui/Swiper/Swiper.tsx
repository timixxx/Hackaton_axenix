import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, EffectCube } from 'swiper/modules';


export const MySwiper = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, EffectFade, A11y]}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      navigation
      pagination={{ clickable: true }}
      effect="fade"
      cubeEffect={
        {
          // shadow: true,
          // slideShadows: true,
          // shadowOffset: 20,
          // shadowScale: 0.94,
        }
      }
    >
      {[1, 2, 3].map((i, el) => {
        return (
          <SwiperSlide>
            <div className="slide">Slide {i}</div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
