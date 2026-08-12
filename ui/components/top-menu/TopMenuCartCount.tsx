"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { IoCartOutline } from "react-icons/io5";
import { getHandleProductsInCartUseCase } from "../../../modules/shared/ui-state/infrastructure/config/factory/handle-products-in-cart-use-case-factory";

export const TopMenuCartCount = () => {
  const storeApi = getHandleProductsInCartUseCase();

  const cartItemCount = useSyncExternalStore(
    (listener) => storeApi.subscribe(listener),
    () => storeApi.getTotalProductsInCart(),
    () => 0,
  );
  return (
    <Link
      href={"/cart"}
      aria-label="Carrito"
      className="relative p-2 rounded-md text-slate-600 transition-all duration-200 hover:bg-gray-100 hover:text-slate-900 active:scale-90"
    >
      <IoCartOutline className="w-5 h-5" />
      {cartItemCount > 0 && (
        <span
          key={cartItemCount}
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white [animation:cartPop_0.35s_ease-out]"
        >
          {cartItemCount}
        </span>
      )}
    </Link>
  );
};
