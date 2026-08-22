import { ValidationResult } from "../../model/validation-result";

export interface ForValidateProduct {
  validateTitle: (title: string) => string | undefined;
  validateSlug: (slug: string) => string | undefined;
  validateDescription: (description: string) => string | undefined;
  validatePrice: (price: number) => string | undefined;
  validateTags: (tags: string[]) => string | undefined;
  validateGender: (gender: string) => string | undefined;
  validateCategory: (category: string) => string | undefined;
  validateSizes: (sizes: string[]) => string | undefined;
  validateImagesQuantity: (quantity: number) => string | undefined;
  validateStock: (stock: number) => string | undefined;
  validateAll: (
    title: string,
    slug: string,
    description: string,
    price: number,
    tags: string[],
    gender: string,
    category: string,
    sizes: string[],
    imagesQuantity: number,
    stock: number,
  ) => ValidationResult;
}
