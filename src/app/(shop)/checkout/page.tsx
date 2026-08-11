import type { Metadata } from "next";
import { initialData } from "@/seed/seed";
import { CheckoutItems, Title } from "../../../../ui";

export const metadata: Metadata = {
  title: "Verificar orden",
  description: "Revisa el resumen de tu orden antes de confirmar la compra.",
};

export default function () {
  return (
    <div className="mb-20 flex justify-center items-center px-4 sm:px-0">
      <div className="flex w-[1000px] flex-col">
        <Title title="Verificar Orden" />
        <CheckoutItems products={initialData.products.slice(0, 3)} />
      </div>
    </div>
  );
}
