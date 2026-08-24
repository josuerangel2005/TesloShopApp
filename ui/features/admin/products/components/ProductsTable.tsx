import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoPencilOutline,
  IoWarningOutline,
} from "react-icons/io5";
import Image from "next/image";
import { Pagination } from "../../../../components/pagination/Pagination";
import { ProductResponse } from "../../../product";
import Link from "next/link";
import { DeleteProductButton } from "./DeleteProductButton";

interface Props {
  products: ProductResponse[];
  totalProducts: number;
}

const ROWS_PER_PAGE = 7;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const StockBadge = ({ inStock }: { inStock: number }) => {
  if (inStock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
        <IoCloseCircleOutline size={14} />
        Agotado
      </span>
    );
  }

  if (inStock <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        <IoWarningOutline size={14} />
        Stock bajo ({inStock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <IoCheckmarkCircleOutline size={14} />
      {inStock} en stock
    </span>
  );
};

export const ProductsTable = ({ products, totalProducts }: Props) => {
  const emptyRows = Math.max(0, ROWS_PER_PAGE - products.length);
  return (
    <>
      <div className="bg-transparent ">
        <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
          <table className="min-w-[800px] md:min-w-0 md:w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  #ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Producto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Categoría
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white transition-colors duration-300 hover:bg-slate-50/70"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-medium text-slate-900">
                    {product.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 ring-1 ring-slate-200">
                        <Image
                          src={product.images[0].url}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {product.title}
                        </span>
                        <span className="text-sm text-slate-500">
                          {product.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                    {usd.format(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StockBadge inStock={product.inStock} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        {product.category.name}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                        {product.gender}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                        href={`/admin/product/${product.slug}`}
                      >
                        <IoPencilOutline size={15} />
                        Modificar
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="px-6 py-4" colSpan={6}>
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination take={ROWS_PER_PAGE} totalElements={totalProducts} />{" "}
    </>
  );
};
