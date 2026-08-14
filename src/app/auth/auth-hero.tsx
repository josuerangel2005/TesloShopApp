import Image from "next/image";
import { titleFont } from "@/config/fonts";

export default function AuthHero() {
  return (
    <aside className="relative hidden overflow-hidden md:block">
      <Image
        src="/products/auth-hero.jpg"
        alt="Teslo | Shop"
        fill
        sizes="50vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-10">
        <p className={`${titleFont.className} text-3xl font-bold text-white`}>
          Teslo <span className="text-primary-light">| Shop</span>
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">
          Moda y estilo para tu día a día. Prendas seleccionadas pensadas para
          vos.
        </p>
      </div>
    </aside>
  );
}