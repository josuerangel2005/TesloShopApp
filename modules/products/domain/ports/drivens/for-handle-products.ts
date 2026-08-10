import { Category } from "../../model/category";
import { CategorySaveCommand } from "../../model/commands/category-save-command";
import { ProductImageSaveCommand } from "../../model/commands/product-image-save-command";
import { ProductSaveCommand } from "../../model/commands/product-save-command";
import { Product } from "../../model/product";
import { ProductImage } from "../../model/productImage";

export interface ForHandleProducts {
  deleteAll: () => Promise<void>;
  saveAllCategories: (categories: CategorySaveCommand[]) => Promise<void>;
  getCategoryByName: (name: string) => Promise<Category>;
  getCategoryById: (category: string) => Promise<Category>;
  saveAllProducts: (products: ProductSaveCommand[]) => Promise<void>;
  saveAllImageProducts: (images: ProductImageSaveCommand[]) => Promise<void>;
  getProductIdBySlug: (slug: string) => Promise<string>;
  getAllProductsWithImages: () => Promise<Product[]>;
  getImageByProductId: (productId: string) => Promise<ProductImage>;
  getImagesByProductId: (productId: string) => Promise<ProductImage[]>;
}
