"use server";

import { getHandleProductsUseCase } from "../../../../modules/products";
import { ProductNotExistsException } from "../../../../modules/products/domain/error/product-not-exists-exception";
import { ProductResponse } from "../interfaces/response/product-response.interface";
import { productToResponse } from "../mappers/product.mapper";

export const getProductBySlug = async (
  slug: string,
): Promise<ProductResponse> => {
  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    const product = await handleProductsUseCase.getProductBySlug(slug);

    if (!product) throw new ProductNotExistsException(slug);

    return productToResponse(product);
  } catch (error) {
    console.log(error);
    if (error instanceof ProductNotExistsException) console.log(error.message);

    throw new Error("Error al obtener producto por slug");
  }
};

export const getStockByProductSlug = async (slug: string): Promise<number> => {
  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    return await handleProductsUseCase.getStockByProductSlug(slug);
  } catch (error) {
    if (error instanceof ProductNotExistsException) console.log(error.message);
    throw error;
  }
};
