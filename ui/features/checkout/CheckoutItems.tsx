"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IoArrowBackOutline,
  IoLocationOutline,
  IoShirtOutline,
} from "react-icons/io5";
import { QuantitySelector, type Product } from "../product";

interface Props {
  products: Product[];
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TAX_RATE = 0.15;

export const CheckoutItems = ({ products }: Props) => {
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
      {/* Items */}
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-slate-800">
          Ajustar Elementos
        </span>
        <Link
          href="/cart"
          className="mb-5 mt-1 flex w-fit items-center gap-1 font-medium text-slate-600 underline-offset-4 hover:text-primary hover:underline"
        >
          <IoArrowBackOutline size={18} />
          Editar Carrito
        </Link>

        {inCart.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600">Tu carrito está vacío</p>
            <Link href="/cart" className="btn-secondary mt-4">
              Continúa comprando
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {inCart.map((product) => (
              <div
                key={product.slug}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <Image
                  src={`/products/${product.images[0]}`}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="size-[100px] rounded-lg object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <p className="truncate font-medium text-slate-800">
                    {product.title}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <IoShirtOutline size={16} className="text-slate-400" />
                      Talla: <span className="font-medium">{product.sizes[0]}</span>
                    </span>
                    <span>
                      Cant.: <span className="font-medium">{quantities[product.slug]}</span>
                    </span>
                  </div>

                  <p className="text-base font-semibold text-slate-900">
                    {usd.format(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {/* Dirección */}
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IoLocationOutline size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Dirección de Entrega
            </h2>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium text-slate-800">Josué Rangel</p>
              <p className="text-slate-500">Av. Siempre Viva 123</p>
              <p className="text-slate-500">Col. Centro · Alcaldía Cuauhtémoc</p>
              <p className="text-slate-500">Ciudad de México</p>
              <p className="text-slate-500">CP. 1010123</p>
              <p className="text-slate-500">12312328</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-100" />

        {/* Resumen de Orden */}
        <h2 className="text-lg font-semibold text-slate-900">
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

        {/* Disclaimer */}
        <p className="mt-8 text-xs leading-relaxed text-slate-500">
          Al hacer click en "Colocar Orden", aceptas nuestros{" "}
          <Link
            href={"/terminos"}
            className="font-medium text-primary hover:underline"
          >
            términos y condiciones
          </Link>{" "}
          y{" "}
          <Link
            href={"/politicas"}
            className="font-medium text-primary hover:underline"
          >
            política de privacidad
          </Link>
        </p>

        <Link
          href="/orders/TS-10293"
          className="btn-primary mt-6 w-full text-center"
        >
          Colocar Orden
        </Link>
      </div>
    </div>
  );
};