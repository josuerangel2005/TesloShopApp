import { ImageUpload } from "../../../../shared/ui-state/domain/model/image-upload";
import { Category } from "../../model/category";
import { CategorySaveCommand } from "../../model/commands/category-save-command";
import { ProductImageSaveCommand } from "../../model/commands/product-image-save-command";
import { ProductSaveCommand } from "../../model/commands/product-save-command";
import { Gender } from "../../model/gender";
import { Product } from "../../model/product";

export interface ForHandleProducts {
  deleteAll: () => Promise<void>;
  getAllProductsWithImages: (page: number, take: number) => Promise<Product[]>;
  getCategoryByName: (name: string) => Promise<Category>;
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
  getProductBySlug: (slug: string) => Promise<Product>;
  getProductsByIds: (ids: string[]) => Promise<Product[]>;
  getStockByProductSlug: (slug: string) => Promise<number>;
  getAllCategories: () => Promise<Category[]>;
  saveProduct: (
    productSave: ProductSaveCommand,
    imagesUpload: ImageUpload[],
  ) => Promise<void>;
  deleteProductById: (productId: string) => Promise<void>;
  updateProduct: (
    productSave: ProductSaveCommand,
    imagesUpload: ImageUpload[],
    productId: string,
    initialImages: string[],
  ) => Promise<void>;
}
