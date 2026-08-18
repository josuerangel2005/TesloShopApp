"use server";

import { getHandleProductsUseCase } from "../../../../modules/products/infrastructure/config/factory/handle-products-use-case-factory";

interface ProductResponse {
  id: string;
  title: string;
  slug: string;
  price: number;
  inStock: number;
  images: string[];
}

export const getProductsByIdsAction = async (
  ids: string[],
): Promise<ProductResponse[]> => {
  try {
    const productsHandler = getHandleProductsUseCase();

    const products = await productsHandler.getProductsByIds(ids);

    return products.map((product) => ({
      id: product.getId(),
      title: product.getTitle(),
      slug: product.getSlug(),
      price: product.getPrice(),
      inStock: product.getInStock(),
      images: product.getProductImages().map((image) => image.getUrl()),
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
