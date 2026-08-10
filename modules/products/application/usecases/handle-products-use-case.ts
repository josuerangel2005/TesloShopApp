import { Product } from "../../domain/model/product";
import { ForHandleProducts } from "../../domain/ports/drivens/for-handle-products";
import { CategorySaveCommand } from "../../domain/model/commands/category-save-command";
import { Category } from "../../domain/model/category";
import { ProductSaveCommand } from "../../domain/model/commands/product-save-command";
import { ProductImageSaveCommand } from "../../domain/model/commands/product-image-save-command";
import { ProductImage } from "../../domain/model/productImage";

export class HandleProductsUseCase {
  private readonly forHandleProducts: ForHandleProducts;

  constructor(forHandleProducts: ForHandleProducts) {
    this.forHandleProducts = forHandleProducts;
  }

  public deleteAll(): Promise<void> {
    return this.forHandleProducts.deleteAll();
  }

  public saveAllCategories(categories: CategorySaveCommand[]): Promise<void> {
    return this.forHandleProducts.saveAllCategories(categories);
  }

  public getCategoryByName(name: string): Promise<Category> {
    return this.forHandleProducts.getCategoryByName(name);
  }

  public getCategoryById(category: string): Promise<Category> {
    return this.forHandleProducts.getCategoryById(category);
  }

  public saveAllProducts(products: ProductSaveCommand[]): Promise<void> {
    return this.forHandleProducts.saveAllProducts(products);
  }

  public saveAllImageProducts(
    images: ProductImageSaveCommand[],
  ): Promise<void> {
    return this.forHandleProducts.saveAllImageProducts(images);
  }

  public getProductIdBySlug(slug: string): Promise<string> {
    return this.forHandleProducts.getProductIdBySlug(slug);
  }

  public getAllProductswithImages(): Promise<Product[]> {
    return this.forHandleProducts.getAllProductsWithImages();
  }

  public getImageByProductId(productId: string): Promise<ProductImage> {
    return this.forHandleProducts.getImageByProductId(productId);
  }

  public getImagesByProductId(productId: string): Promise<ProductImage[]> {
    return this.forHandleProducts.getImagesByProductId(productId);
  }
}
