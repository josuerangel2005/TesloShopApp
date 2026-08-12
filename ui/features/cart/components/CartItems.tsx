"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  IoArrowBackOutline,
  IoCartOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { QuantitySelector } from "../../product";
import { getHandleProductsInCartUseCase } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-products-in-cart-use-case-factory";
import { CartProduct } from "../../../../modules/shared/ui-state/domain/model/cart-product";
import { currencyFormat } from "../utils/currency-format";

const TAX_RATE = 0.15;
const EMPTY_CART: CartProduct[] = [];

const cartItemKey = (product: CartProduct) =>
  `${product.getSlug()}-${product.getSize()}`;

export const CartItems = () => {
  const storeApi = getHandleProductsInCartUseCase();

  const products = useSyncExternalStore(
    (listener) => storeApi.subscribe(listener),
    () => storeApi.getAllProductsInCart(),
    () => EMPTY_CART,
  );

  const inCart = products;

  const totalItems = inCart.reduce(
    (sum, product) => sum + product.getQuantity(),
    0,
  );
  const subtotal = inCart.reduce(
    (sum, product) => sum + product.getPrice() * product.getQuantity(),
    0,
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const changeQty = (product: CartProduct, quantity: number) => {
    const clamped = Math.min(Math.max(quantity, 1), product.getInStock());
    storeApi.updateProductQuantity(product.getId(), product.getSize(), clamped);
  };

  const remove = (product: CartProduct) => {
    storeApi.removeProductFromCart(product.getId(), product.getSize());
  };

  if (inCart.length === 0) {
    return (
      <div className="fade-in flex w-full flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary-light/10">
          <IoCartOutline className="size-10 text-primary [animation:cartPop_0.45s_ease-out]" />
        </div>
        <p className="mt-5 text-lg font-semibold text-slate-800">
          Tu carrito está vacío
        </p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Todavía no agregaste productos. Explorá la tienda y encontrá algo que
          te guste.
        </p>
        <Link href="/" className="btn-secondary mt-6">
          Continúa comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
      <div className="flex flex-col">
        <span className="text-xl">Agregar más items</span>
        <Link
          href="/"
          className="mb-5 mt-1 flex w-fit items-center gap-1 font-medium text-slate-600 underline-offset-4 hover:text-primary hover:underline"
        >
          <IoArrowBackOutline size={18} />
          Continúa comprando
        </Link>

        <div className="flex flex-col gap-4">
          {inCart.map((product) => (
            <div
              key={cartItemKey(product)}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md"
            >
              <Image
                src={`/products/${product.getImage()}`}
                alt={product.getTitle()}
                width={100}
                height={100}
                className="size-[100px] rounded-lg object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {product.getTitle()}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {currencyFormat(product.getPrice())}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(product)}
                    className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm text-red-500 transition-colors hover:text-red-600 hover:underline"
                  >
                    <IoTrashOutline size={18} />
                    Remover
                  </button>
                </div>

                <QuantitySelector
                  quantity={product.getQuantity()}
                  max={product.getInStock()}
                  onQuantityChange={(quantity) => changeQty(product, quantity)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">
          Resumen de Orden
        </h2>

        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">No. Productos</span>
            <span className="text-right font-medium text-slate-900">
              {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-right font-medium text-slate-900">
              {currencyFormat(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Impuestos (15%)</span>
            <span className="text-right font-medium text-slate-900">
              {currencyFormat(tax)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-lg font-semibold text-slate-900">Total</span>
          <span className="text-right text-2xl font-bold text-slate-900">
            {currencyFormat(total)}
          </span>
        </div>

        <Link
          href="/checkout/address"
          className="btn-primary mt-6 w-full text-center"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};
