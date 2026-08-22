import { getProductBySlug, Title } from "../../../../../../ui";
import { getAllCategoriesAction } from "../../../../../../ui/features/admin/product/actions/get-all-categories-action";
import { ProductForm } from "../../../../../../ui/features/admin/product/components/ProductForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ({ params }: Props) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  const categories = await getAllCategoriesAction();
  return (
    <>
      <Title title="Actualizar" subTitle="Actualizar un producto" />
      <ProductForm product={product} categories={categories} />{" "}
    </>
  );
}
