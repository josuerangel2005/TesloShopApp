import type { Metadata } from "next";
import { CartItems, Title } from "../../../../ui";
import { initialData } from "@/seed/seed";

export const metadata: Metadata = {
  title: "Carrito de compras",
  description: "Revisa los productos de tu carrito antes de comprar.",
};

export default function CartPage() {
  return (
    <div className="mb-20 flex justify-center items-center px-4 sm:px-0">
      <div className="flex w-[1000px] flex-col">
        <Title title="Carrito" />
        <CartItems />
      </div>
    </div>
  );
}
