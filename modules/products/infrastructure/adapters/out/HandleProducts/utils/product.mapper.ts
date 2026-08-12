import type { Prisma } from "@/generated/prisma/client";
import { Product } from "../../../../../domain/model/product";
import { Size } from "../../../../../../shared/ui-state/domain/model/size";
import { Gender as GenderModel } from "../../../../../domain/model/gender";
import { categoryRowToDomain } from "./category.mapper";
import { productImageRowToDomain } from "./product-image.mapper";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; productImages: true };
}>;

export const productRowToDomain = (row: ProductWithRelations): Product =>
  new Product(
    row.id,
    row.title,
    row.description,
    row.inStock,
    row.price,
    row.sizes as Size[],
    row.slug,
    row.tags,
    row.gender as GenderModel,
    categoryRowToDomain(row.category),
    row.productImages.map((img) => productImageRowToDomain(img)),
  );