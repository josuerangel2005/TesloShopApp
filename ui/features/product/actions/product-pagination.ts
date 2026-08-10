"use server";

import { getHandleProductsUseCase } from "../../../../modules/products";
import { GenderNotExistsException } from "../../../../modules/products/domain/error/gender-not-exists-exception";
import { Gender } from "../../../../modules/products/domain/model/gender";
import { ProductResponse } from "../interfaces/response/product-response.interface";
import { productToResponse } from "../mappers/product.mapper";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
}: PaginationOptions = {}): Promise<ProductResponse[]> => {
  if (isNaN(page) || isNaN(take)) page = 1;
  if (page < 1) page = 1;
  if (take < 1) take = 12;

  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    const data = await handleProductsUseCase.getAllProductswithImages(
      page,
      take,
    );

    return data.map(productToResponse);
  } catch (error) {
    throw error;
  }
};

export const getQuantityProducts = async (): Promise<number> => {
  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    return await handleProductsUseCase.getQuantityProducts();
  } catch (error) {
    throw error;
  }
};

export const getProductsByGender = async (
  gender: Gender,
  { page = 1, take = 12 }: PaginationOptions = {},
): Promise<ProductResponse[]> => {
  const handleProductsUseCase = getHandleProductsUseCase();

  if (isNaN(page) || isNaN(take)) page = 1;
  if (page < 1) page = 1;
  if (take < 1) take = 12;

  try {
    if (!Object.values(Gender).includes(gender))
      throw new GenderNotExistsException(gender);

    const data = await handleProductsUseCase.getProductsByGender(
      gender,
      page,
      take,
    );

    return data.map(productToResponse);
  } catch (error) {
    throw error;
  }
};

export const getQuantityProductsByGender = async (
  gender: Gender,
): Promise<number> => {
  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    return await handleProductsUseCase.getQuantityProductsByGender(gender);
  } catch (error) {
    throw error;
  }
};
