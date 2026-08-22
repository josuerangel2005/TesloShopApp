import { ValidationResult } from "../../domain/model/validation-result";
import { ForValidateProduct } from "../../domain/ports/drivens/for-validate-product";

export class ValidateProductUseCase {
  private readonly forValidateProduct: ForValidateProduct;

  constructor(forValidateProduct: ForValidateProduct) {
    this.forValidateProduct = forValidateProduct;
  }

  public validateAll(
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
  ): ValidationResult {
    return this.forValidateProduct.validateAll(
      title,
      slug,
      description,
      price,
      tags,
      gender,
      category,
      sizes,
      imagesQuantity,
      stock,
    );
  }
}
