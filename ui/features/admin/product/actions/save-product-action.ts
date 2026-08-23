"use server";

import { getHandleProductsUseCase } from "../../../../../modules/products";
import { ProductAlreadyExistsException } from "../../../../../modules/products/domain/error/product-already-exists-exception";
import { ProductSaveCommand } from "../../../../../modules/products/domain/model/commands/product-save-command";
import { Gender } from "../../../../../modules/products/domain/model/gender";
import { ValidationResult } from "../../../../../modules/products/domain/model/validation-result";
import { getValidateProductUseCase } from "../../../../../modules/products/infrastructure/config/factory/validate-product-use-case-factory";
import { ImageUpload } from "../../../../../modules/shared/ui-state/domain/model/image-upload";
import { Size } from "../../../../../modules/shared/ui-state/domain/model/size";
import { ProductFormResponse } from "../interfaces/product-form-response";

export const saveProductAction = async (
  data: ProductFormResponse,
  imagesUpload: File[],
): Promise<ValidationResult | { success: false; message: string }> => {
  const validateProductUseCase = getValidateProductUseCase();
  const handleProductsUseCase = getHandleProductsUseCase();

  // El input de etiquetas es texto plano ("shirt, t-shirt"): normalizar a array
  const tags = Array.isArray(data.tags)
    ? data.tags
    : String(data.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  try {
    //validaciones
    const result = validateProductUseCase.validateAll(
      data.title,
      data.slug,
      data.description,
      +data.price,
      tags,
      data.gender,
      data.category.name,
      data.sizes,
      imagesUpload.length,
      +data.inStock,
    );

    if (!result.success) return result;

    //Persistir cambios del producto
    await handleProductsUseCase.saveProduct(
      new ProductSaveCommand(
        data.description,
        data.title,
        +data.inStock,
        +data.price,
        data.sizes as Size[],
        data.slug,
        tags,
        data.gender as Gender,
        (
          await handleProductsUseCase.getCategoryByName(data.category.name)
        ).getId(),
      ),
      await Promise.all(
        imagesUpload.map(
          async (file) =>
            new ImageUpload(
              Buffer.from(await file.arrayBuffer()),
              file.type,
              file.name,
            ),
        ),
      ),
    );

    return { success: true };
  } catch (error) {
    if (error instanceof ProductAlreadyExistsException)
      return {
        success: false,
        message: "Slug ya existente",
      };
    console.log(error);
    throw error;
  }
};
