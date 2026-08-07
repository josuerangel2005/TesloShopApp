import { initialData } from "@/seed/seed";
import { Title } from "../../../ui";
import { ProductsGrid } from "../../../ui/features/products";

const products = initialData.products;

export default function Home() {
  return (
    <>
      <Title title="Tienda" subTitle="Todos los productos" className="mb-2" />
      <ProductsGrid products={products} />
    </>
  );
}
