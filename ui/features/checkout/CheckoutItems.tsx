"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  IoArrowBackOutline,
  IoLocationOutline,
  IoShirtOutline,
} from "react-icons/io5";
import { getHandleProductsInCartUseCase } from "../../../modules/shared/ui-state/infrastructure/config/factory/handle-products-in-cart-use-case-factory";
import { CartProduct } from "../../../modules/shared/ui-state/domain/model/cart-product";
import { getHandleAddressStateUseCase } from "../../../modules/shared/ui-state/infrastructure/config/factory/handle-address-state-use-case-factory";
import { saveOrderAction } from "./actions/save-order-action";
import { addressToCheckoutAddress } from "./mapper/checkout-address.mapper";
import { cartProductsToCheckoutCartProducts } from "./mapper/checkout-cart-product.mapper";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TAX_RATE = 0.15;

const EMPTY_CART: CartProduct[] = [];

export const CheckoutItems = () => {
  const storeApi = getHandleProductsInCartUseCase();

  const handleAddressStateUseCase = getHandleAddressStateUseCase();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const address = useSyncExternalStore(
    (listener) => handleAddressStateUseCase.subscribe(listener),
    () => handleAddressStateUseCase.getAddress(),
    () => null,
  );

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

  const onPlaceOrder = async () => {
    if (!address || !products) return;

    setIsPlacingOrder(true);
    setOrderError(null);

    const result = await saveOrderAction(
      addressToCheckoutAddress(address),
      cartProductsToCheckoutCartProducts(products),
    );

    if (!result.ok && result.kind === "user") {
      setOrderError(result.message);
    }

    setIsPlacingOrder(false);
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
                key={product.getSlug()}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <Image
                  src={`/products/${product.getImage()}`}
                  alt={product.getTitle()}
                  width={100}
                  height={100}
                  className="size-[100px] rounded-lg object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <p className="truncate font-medium text-slate-800">
                    {product.getTitle()}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <IoShirtOutline size={16} className="text-slate-400" />
                      Talla:{" "}
                      <span className="font-medium">{product.getSize()}</span>
                    </span>
                    <span>
                      Cant.:{" "}
                      <span className="font-medium">
                        {product.getQuantity()}
                      </span>
                    </span>
                  </div>

                  <div className="flex w-full items-baseline gap-2">
                    <p className="flex-1 text-sm font-medium text-slate-500">
                      {usd.format(product.getPrice())}
                      <span className="ml-1 text-slate-400">
                        × {product.getQuantity()}
                      </span>
                    </p>

                    <p className="text-base font-semibold text-slate-900">
                      {usd.format(product.getPrice() * product.getQuantity())}
                    </p>
                  </div>
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
              <p className="font-medium text-slate-800">
                {address?.getFirstName()} {address?.getLastName()}
              </p>
              <p className="text-slate-500">{address?.getAddress()}</p>
              <p className="text-slate-500">{address?.getCity()}</p>
              <p className="text-slate-500">{address?.getCountry()}</p>
              <p className="text-slate-500">{address?.getPostalCode()}</p>
              <p className="text-slate-500">{address?.getPhone()}</p>
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

        <button
          className="btn-primary mt-6 w-full text-center disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          disabled={isPlacingOrder}
          onClick={() => onPlaceOrder()}
        >
          Colocar Orden
        </button>

        {orderError && (
          <p className="mt-3 text-center text-sm font-medium text-red-600">
            {orderError}
          </p>
        )}
      </div>
    </div>
  );
};
