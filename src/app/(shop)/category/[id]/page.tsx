import { notFound } from "next/navigation";
import { ProductsGrid, Title, validGenders } from "../../../../../ui";
import { initialData } from "@/seed/seed";

interface Props {
  params: Promise<{ id: string }>;
}

const products = initialData.products;

export default async function ({ params }: Props) {
  const { id } = await params;

  if (!validGenders.includes(id)) notFound();

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
      <ProductsGrid
        products={products.filter((product) => product.gender === id)}
      />
    </>
  );
}
