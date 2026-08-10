import type { Prisma } from "@/generated/prisma/client";
import { Product } from "../../../../../domain/model/product";
import { Category } from "../../../../../domain/model/category";
import { ProductImage } from "../../../../../domain/model/productImage";
import { Size } from "../../../../../domain/model/size";
import { Gender as GenderModel } from "../../../../../domain/model/gender";

export const productRowToDomain = (
  row: Prisma.ProductGetPayload<{}>,
  category: Category,
  images: ProductImage[],
): Product =>
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
    category,
    images,
  );