import { Gender } from "../../../modules/products/domain/model/gender";
import { ProductImageSaveCommand } from "../../../modules/products/domain/model/commands/product-image-save-command";
import { ProductSaveCommand } from "../../../modules/products/domain/model/commands/product-save-command";
import { Size } from "../../../modules/products/domain/model/size";
import { Product } from "../../../ui/features/product/interfaces/product.interface";

export const toProductSaveCommand = (
  product: Product,
  categoryId: string,
): ProductSaveCommand =>
  new ProductSaveCommand(
    product.description,
    product.title,
    product.inStock,
    product.price,
    product.sizes as Size[],
    product.slug,
    product.tags,
    product.gender as Gender,
    categoryId,
  );

export const toProductImageSaveCommand = (
  url: string,
  productId: string,
): ProductImageSaveCommand => new ProductImageSaveCommand(url, productId);