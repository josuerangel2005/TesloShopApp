export const revalidate = 60;

import { Title } from "../../../ui";
import { ProductsGrid } from "../../../ui/features/products";
import {
  getPaginatedProductsWithImages,
  getQuantityProducts,
} from "../../../ui/features/product/actions/product-pagination";
import { Pagination } from "../../../ui/components/pagination/Pagination";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ page: number }>;
}

export default async function ({ searchParams }: Props) {
  const page = (await searchParams).page;
  const productsTemp = await getPaginatedProductsWithImages({
    page,
  });
  const totalProducts = await getQuantityProducts();

  if (productsTemp.length === 0) redirect("/");

  return (
    <>
      <Title title="Tienda" subTitle="Todos los productos" className="mb-2" />
      <ProductsGrid products={productsTemp} />
      <Pagination take={12} totalElements={totalProducts} />
    </>
  );
}
