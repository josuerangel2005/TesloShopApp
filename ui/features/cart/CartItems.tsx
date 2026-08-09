"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoArrowBackOutline, IoTrashOutline } from "react-icons/io5";
import { QuantitySelector, type Product } from "../product";

interface Props {
  products: Product[];
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TAX_RATE = 0.15;

export const CartItems = ({ products }: Props) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    products.reduce<Record<string, number>>((acc, product) => {
      acc[product.slug] = 1;
      return acc;
    }, {}),
  );

  const inCart = products.filter((product) => product.slug in quantities);

  const totalItems = inCart.reduce(
    (sum, product) => sum + quantities[product.slug],
    0,
  );
  const subtotal = inCart.reduce(
    (sum, product) => sum + product.price * quantities[product.slug],
    0,
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const changeQty = (slug: string, quantity: number) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;

    const clamped = Math.min(Math.max(quantity, 1), product.inStock);
    setQuantities((prev) => ({ ...prev, [slug]: clamped }));
  };

  const remove = (slug: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  };

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

        {inCart.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600">Tu carrito está vacío</p>
            <Link href="/" className="btn-secondary mt-4">
              Continúa comprando
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {inCart.map((product) => (
              <div
                key={product.slug}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md"
              >
                <Image
                  src={`/products/${product.images[0]}`}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="size-[100px] rounded-lg object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">
                        {product.title}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {usd.format(product.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm text-red-500 transition-colors hover:text-red-600 hover:underline"
                    >
                      <IoTrashOutline size={18} />
                      Remover
                    </button>
                  </div>

                  <QuantitySelector
                    quantity={quantities[product.slug]}
                    max={product.inStock}
                    onQuantityChange={(quantity) =>
                      changeQty(product.slug, quantity)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {inCart.length > 0 ? (
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
              {usd.format(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Impuestos (15%)</span>
            <span className="text-right font-medium text-slate-900">
              {usd.format(tax)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-lg font-semibold text-slate-900">Total</span>
          <span className="text-right text-2xl font-bold text-slate-900">
            {usd.format(total)}
          </span>
        </div>

        <Link
            href="/checkout/address"
            className="btn-primary mt-6 w-full text-center"
          >
            Checkout
          </Link>
        </div>
      ) : null}
    </div>
  );
};
