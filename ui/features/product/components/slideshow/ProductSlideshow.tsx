"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperObject } from "swiper";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./slideshow.css";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const ProductSlideshow = ({ images, title, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#274494",
            "--swiper-navigation-size": "24px",
            "--swiper-pagination-color": "#274494",
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={
          prefersReducedMotion()
            ? false
            : {
                delay: 4000,
                disableOnInteraction: true,
              }
        }
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image}>
            <Image
              width={1024}
              height={800}
              src={image}
              alt={`${title} — imagen ${index + 1}`}
              className="h-full w-full rounded-lg bg-white object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Thumbs]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image}>
            <Image
              width={300}
              height={300}
              src={image}
              alt={`${title} — imagen ${index + 1}`}
              className="h-full w-full cursor-pointer rounded-xl bg-white object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
