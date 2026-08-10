import type { Prisma } from "@/generated/prisma/client";
import { ProductImage } from "../../../../../domain/model/productImage";

export const productImageRowToDomain = (
  row: Prisma.ProductImageGetPayload<{}>,
): ProductImage => new ProductImage(row.id, row.url, row.productId);