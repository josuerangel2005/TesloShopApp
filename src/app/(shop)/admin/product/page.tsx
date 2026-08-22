import { Title } from "../../../../../ui";
import { getAllCategoriesAction } from "../../../../../ui/features/admin/product/actions/get-all-categories-action";
import { ProductForm } from "../../../../../ui/features/admin/product/components/ProductForm";

export default async function () {
  const categories = await getAllCategoriesAction();
  return (
    <>
      <Title title="Crear" subTitle="Guardar un nuevo producto" />
      <ProductForm categories={categories} />{" "}
    </>
  );
}
