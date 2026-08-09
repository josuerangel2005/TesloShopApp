import { CartItems, Title } from "../../../../ui";
import { initialData } from "@/seed/seed";

export default function CartPage() {
  return (
    <div className="mb-20 flex justify-center items-center px-4 sm:px-0">
      <div className="flex w-[1000px] flex-col">
        <Title title="Carrito" />
        <CartItems products={initialData.products.slice(0, 3)} />
      </div>
    </div>
  );
}
