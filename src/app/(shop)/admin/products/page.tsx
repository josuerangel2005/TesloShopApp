import type { Metadata } from "next";
import {
  AddProductButton,
  getPaginatedProductsWithImages,
  getQuantityProducts,
  ProductsTable,
  Title,
} from "../../../../../ui";

export const metadata: Metadata = {
  title: "Productos",
  description: "Administración de productos de la tienda.",
};

interface Props {
  searchParams: Promise<{ page: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = +(await searchParams).page;
  const products = await getPaginatedProductsWithImages({ take: 7, page });
  const totalProducts = await getQuantityProducts();

  return (
    <div className="mb-20 flex flex-col items-center px-4 sm:px-0">
      <div className="flex w-full flex-col">
        <Title title="Productos" subTitle="Administración del catálogo" />

        <div className="mb-6 flex items-center justify-between">
          <AddProductButton />
          <span className="text-sm text-slate-500 sm:text-right">
            {totalProducts} productos
          </span>
        </div>

        <ProductsTable products={products} totalProducts={totalProducts} />
      </div>
    </div>
  );
}
