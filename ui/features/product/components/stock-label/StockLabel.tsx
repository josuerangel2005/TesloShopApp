"use client";
import { titleFont } from "@/config/fonts";
import { getStockByProductSlug } from "../../actions/get-product-by-slug";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const getStock = async () => {
    const stock = await getStockByProductSlug(slug);
    setStock(stock);
    setIsLoading(false);
  };

  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStock();
  }, [stock, getStock]);

  return (
    <>
      {isLoading ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-300" />
          <span className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        </div>
      ) : (
        <span
          className={`${titleFont.className} mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Stock: {stock} unidades
        </span>
      )}
    </>
  );
};
