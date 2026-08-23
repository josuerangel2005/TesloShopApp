"use server";

import { revalidatePath } from "next/cache";
import { ProductNotExistsException } from "../../../../../modules/orders/domain/error/product-not-exists-exception";
import { getHandleProductsUseCase } from "../../../../../modules/products";

export const deleteProductByIdAction = async (
  productId: string,
): Promise<void> => {
  const handleProducts = getHandleProductsUseCase();
  try {
    await handleProducts.deleteProductById(productId);
  } catch (error) {
    if (error instanceof ProductNotExistsException) console.log(error.message);
    throw error;
  }
  revalidatePath("/admin/products");
};
