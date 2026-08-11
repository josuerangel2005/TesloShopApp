export const revalidate = 60;

export const metadata: Metadata = {
  title: "Categoría",
  description: "Explora los productos de la categoría seleccionada.",
};

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductsGrid, Title, validGenders } from "../../../../../ui";
import {
  getProductsByGender,
  getQuantityProductsByGender,
} from "../../../../../ui/features/product/actions/product-pagination";
import { Gender } from "../../../../../modules/products/domain/model/gender";
import { Pagination } from "../../../../../ui/components/pagination/Pagination";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: number }>;
}

export default async function ({ params, searchParams }: Props) {
  const { id } = await params;

  if (!validGenders.includes(id)) notFound();

  const { page } = await searchParams;

  const products = await getProductsByGender(
    id.trim().toUpperCase() as Gender,
    { page },
  );
  const totalProducts = await getQuantityProductsByGender(
    id.trim().toUpperCase() as Gender,
  );

  return (
    <>
      <Title
        title="Tienda"
        subTitle={
          id === "men"
            ? "Productos Hombre"
            : id === "women"
              ? "Productos Mujer"
              : "Productos Niño"
        }
        className="mb-2"
      />
      <ProductsGrid products={products} />
      <Pagination take={12} totalElements={totalProducts} />
    </>
  );
}
