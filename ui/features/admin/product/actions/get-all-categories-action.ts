import { getHandleProductsUseCase } from "../../../../../modules/products";
import { CategoryResponse } from "../interfaces/category-response";

export const getAllCategoriesAction = async (): Promise<CategoryResponse[]> => {
  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    return (await handleProductsUseCase.getAllCategories()).map(
      (category) =>
        ({
          name: category.getName(),
        }) as CategoryResponse,
    );
  } catch (error) {
    console.error("Error fetching categories:");
    throw error;
  }
};
