"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ScrollShadowProps {
  children: ReactNode;
}

export const ScrollShadow = ({ children }: ScrollShadowProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-gray-200 shadow-sm" : "border-gray-100 shadow-none"
      }`}
    >
      {children}
    </header>
  );
};