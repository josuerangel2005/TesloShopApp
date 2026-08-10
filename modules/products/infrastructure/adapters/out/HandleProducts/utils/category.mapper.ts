import type { Prisma } from "@/generated/prisma/client";
import { Category } from "../../../../../domain/model/category";

export const categoryRowToDomain = (row: Prisma.CategoryGetPayload<{}>): Category =>
  new Category(row.id, row.name);