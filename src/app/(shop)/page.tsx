export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explora el catálogo completo de productos disponibles en la tienda.",
  openGraph: {
    title: "Catálogo de productos",
    description:
      "Explora el catálogo completo de productos disponibles en la tienda.",
  },
};

import type { Metadata } from "next";
import { Title } from "../../../ui";
import { ProductsGrid } from "../../../ui/features/products";
import {
  getPaginatedProductsWithImages,
  getQuantityProducts,
} from "../../../ui/features/product/actions/product-pagination";
import { Pagination } from "../../../ui/components/pagination/Pagination";
import { Suspense } from "react";
import { Fallback } from "../../../ui/components/fallback/Fallback";
import { ProductsNotFound } from "../../../ui/components/not-found/ProductsNotFound";

interface Props {
  searchParams: Promise<{ page: number; search: string }>;
}

export default function CatalogPage({ searchParams }: Props) {
  return (
    <>
      <Title title="Tienda" subTitle="Todos los productos" className="mb-2" />
      <Suspense fallback={<Fallback entity="productos" />}>
        <AsyncProductsGrid searchParams={searchParams} />
      </Suspense>
    </>
  );
}

export async function AsyncProductsGrid({ searchParams }: Props) {
  const page = (await searchParams).page;
  const search = (await searchParams).search;
  const products = await getPaginatedProductsWithImages({
    page,
    search,
  });
  const totalProducts = await getQuantityProducts(search);

  if (products.length === 0) return <ProductsNotFound />;

  return (
    <>
      <ProductsGrid products={products} />
      <Pagination take={12} totalElements={totalProducts} />
    </>
  );
}
