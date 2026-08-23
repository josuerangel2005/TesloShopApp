"use client";

import { titleFont } from "@/config/fonts";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const ProductsNotFound = () => {
  const params = useSearchParams();

  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center px-6 py-1">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-12 md:flex-row md:gap-16">
        {/* Texto */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <span className="reveal mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-primary [animation-delay:0ms]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Sin resultados
          </span>
          <h2
            className={`${titleFont.className} reveal antialiased bg-gradient-to-r from-primary via-primary-light to-primary bg-[length:200%_auto] bg-clip-text text-[7rem] font-bold leading-none text-transparent sm:text-[9rem] md:text-[11rem] [animation-delay:120ms]`}
            style={{
              animation:
                "reveal 0.7s ease-out 120ms both, shine 4s linear infinite",
            }}
          >
            0
          </h2>
          <p className="reveal mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl [animation-delay:240ms]">
            No encontramos productos.
          </p>
          <p className="reveal mt-2 max-w-md text-lg font-light text-slate-500 [animation-delay:340ms]">
            No hay resultados que coincidan con tu búsqueda o filtros "
            {params.get("search")}". Prueba con otros términos o explora todo el
            catálogo.
          </p>
          <Link
            href={"/"}
            className="btn-primary reveal group relative mt-8 overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 [animation-delay:460ms]"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Ver todos los productos
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
        {/* Imagen */}
        <div className="reveal relative flex-none [animation-delay:200ms]">
          <div
            className="absolute -inset-10 rounded-full bg-primary/15 blur-3xl motion-safe:animate-[pulseGlow_4s_ease-in-out_infinite]"
            aria-hidden
          />
          <Image
            src={"/imgs/starman_750x750.png"}
            alt="Astronauta flotando, sin resultados"
            priority
            className="relative w-72 h-72 object-contain drop-shadow-xl sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] motion-safe:animate-[float_6s_ease-in-out_infinite]"
            width={550}
            height={550}
          />
        </div>
      </div>
      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
        .reveal {
          opacity: 0;
          animation: reveal 0.7s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};
