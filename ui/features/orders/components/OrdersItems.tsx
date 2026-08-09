import Image from "next/image";
import Link from "next/link";
import {
  IoCardOutline,
  IoCheckmarkCircleOutline,
  IoLocationOutline,
  IoShirtOutline,
} from "react-icons/io5";
import { type Product } from "../../product";

interface Props {
  products: Product[];
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TAX_RATE = 0.15;

export const OrdersItems = ({ products }: Props) => {
  const quantities = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.slug] = 1;
    return acc;
  }, {});

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

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
      {/* Items */}
      <div className="flex flex-col">
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <IoCheckmarkCircleOutline size={22} />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Orden pagada
            </p>
            <p className="text-xs text-emerald-600">
              ID de transacción: TS-10293
            </p>
          </div>
        </div>

        {inCart.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600">No hay productos en esta orden</p>
            <Link href="/" className="btn-secondary mt-4">
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
                      Talla:{" "}
                      <span className="font-medium">{product.sizes[0]}</span>
                    </span>
                    <span>
                      Cant.:{" "}
                      <span className="font-medium">
                        {quantities[product.slug]}
                      </span>
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
              <p className="text-slate-500">
                Col. Centro · Alcaldía Cuauhtémoc
              </p>
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

        <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
          <IoCardOutline size={22} className="shrink-0 text-slate-400" />
          <p className="text-xs leading-relaxed text-slate-500">
            Pagado con tarjeta de crédito · Visa terminada en 4242.
          </p>
        </div>

        <Link href="/" className="btn-primary mt-6 w-full text-center">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};
