import { Title } from "../../../ui";
import { ProductsGrid } from "../../../ui/features/products";
import { getPaginatedProductsWithImages } from "../../../ui/features/product/actions/product-pagination";

export default async function () {
  const productsTemp = await getPaginatedProductsWithImages();

  return (
    <>
      <Title title="Tienda" subTitle="Todos los productos" className="mb-2" />
      <ProductsGrid products={productsTemp} />
    </>
  );
}
