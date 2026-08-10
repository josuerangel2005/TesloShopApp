import { Category } from "../../model/category";
import { CategorySaveCommand } from "../../model/commands/category-save-command";
import { ProductImageSaveCommand } from "../../model/commands/product-image-save-command";
import { ProductSaveCommand } from "../../model/commands/product-save-command";
import { Gender } from "../../model/gender";
import { Product } from "../../model/product";
import { ProductImage } from "../../model/productImage";

export interface ForHandleProducts {
  deleteAll: () => Promise<void>;
  getAllProductsWithImages: (page: number, take: number) => Promise<Product[]>;
  getCategoryById: (category: string) => Promise<Category>;
  getCategoryByName: (name: string) => Promise<Category>;
  getImagesByProductId: (productId: string) => Promise<ProductImage[]>;
  getProductIdBySlug: (slug: string) => Promise<string>;
  getProductsByGender: (
    gender: Gender,
    page: number,
    take: number,
  ) => Promise<Product[]>;
  getQuantityProducts: () => Promise<number>;
  saveAllCategories: (categories: CategorySaveCommand[]) => Promise<void>;
  saveAllImageProducts: (images: ProductImageSaveCommand[]) => Promise<void>;
  saveAllProducts: (products: ProductSaveCommand[]) => Promise<void>;
  getQuantityProductsByGender: (gender: Gender) => Promise<number>;
}
