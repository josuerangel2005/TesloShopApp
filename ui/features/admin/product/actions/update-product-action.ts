"use server";

import { revalidatePath } from "next/cache";
import { getHandleProductsUseCase } from "../../../../../modules/products";
import { ProductSaveCommand } from "../../../../../modules/products/domain/model/commands/product-save-command";
import { Gender } from "../../../../../modules/products/domain/model/gender";
import { ValidationResult } from "../../../../../modules/products/domain/model/validation-result";
import { getValidateProductUseCase } from "../../../../../modules/products/infrastructure/config/factory/validate-product-use-case-factory";
import { ImageUpload } from "../../../../../modules/shared/ui-state/domain/model/image-upload";
import { Size } from "../../../../../modules/shared/ui-state/domain/model/size";
import { ProductFormResponse } from "../interfaces/product-form-response";

export const updateProductAction = async (
  data: ProductFormResponse,
  imagesUpload: File[],
  initialImages: string[],
): Promise<ValidationResult> => {
  const validateProductUseCase = getValidateProductUseCase();
  const handleProductsUseCase = getHandleProductsUseCase();
  try {
    //validaciones
    const result = validateProductUseCase.validateAll(
      data.title,
      data.slug,
      data.description,
      data.price,
      data.tags,
      data.gender,
      data.category.name,
      data.sizes,
      initialImages.length + imagesUpload.length,
      data.inStock,
    );

    if (result.success) return result;

    //Persistir cambios del producto
    await handleProductsUseCase.updateProduct(
      new ProductSaveCommand(
        data.description,
        data.title,
        data.inStock,
        data.price,
        data.sizes as Size[],
        data.slug,
        data.tags,
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
      data.id,
      initialImages,
    );

    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
