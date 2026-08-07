"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  hoverSrc: string;
  hoverAlt: string;
  aspectClass?: string;
}

export const ProductGridImage = ({ src, alt, hoverSrc, hoverAlt }: Props) => {
  const [displayImage, setDisplayImage] = useState(src);
  const [altImage, setAltImage] = useState(alt);

  return (
    <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
      <Image
        src={displayImage}
        alt={altImage}
        width={500}
        height={500}
        className={`object-cover transition-all duration-500 ease-out`}
        onMouseEnter={() => {
          setDisplayImage(hoverSrc);
          setAltImage(hoverAlt);
        }}
        onMouseLeave={() => {
          setDisplayImage(src);
          setAltImage(hoverSrc);
        }}
      />
    </div>
  );
};
