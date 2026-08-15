import type { Metadata } from "next";
import { Title } from "../../../../../ui";
import { AddressForm } from "../../../../../ui/features/address/components/AddressForm";

export const metadata: Metadata = {
  title: "Dirección de entrega",
  description: "Ingresa la dirección de entrega de tu orden de compra.",
};

const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function () {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-0">
      <div className="flex w-full flex-col text-left xl:w-[1000px]">
        <Title title="Dirección" subTitle="Dirección de entrega" />

        <AddressForm />

        <style>{`
          .address-card {
            animation: addressFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .address-field {
            opacity: 0;
            animation: addressFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .address-field:nth-child(1) { animation-delay: 0.05s; }
          .address-field:nth-child(2) { animation-delay: 0.10s; }
          .address-field:nth-child(3) { animation-delay: 0.15s; }
          .address-field:nth-child(4) { animation-delay: 0.20s; }
          .address-field:nth-child(5) { animation-delay: 0.25s; }
          .address-field:nth-child(6) { animation-delay: 0.30s; }
          .address-field:nth-child(7) { animation-delay: 0.35s; }
          .address-field:nth-child(8) { animation-delay: 0.40s; }
          .address-submit { animation-delay: 0.48s; }

          @keyframes addressFadeUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .address-card,
            .address-field {
              opacity: 1;
              animation: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
