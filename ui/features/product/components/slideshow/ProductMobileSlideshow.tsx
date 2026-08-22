"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./slideshow.css";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={
          {
            "--swiper-pagination-color": "#274494",
          } as React.CSSProperties
        }
        pagination
        loop
        slidesPerView={1}
        autoplay={
          prefersReducedMotion()
            ? false
            : {
                delay: 4000,
                disableOnInteraction: true,
              }
        }
        modules={[Autoplay, Pagination]}
        className="mySwiper2"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image}>
            <Image
              width={600}
              height={500}
              src={image}
              alt={`${title} — imagen ${index + 1}`}
              className="h-full w-full rounded-lg bg-white object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
