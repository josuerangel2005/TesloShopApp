import { Product } from "../../domain/model/product";
import { ForHandleProducts } from "../../domain/ports/drivens/for-handle-products";
import { CategorySaveCommand } from "../../domain/model/commands/category-save-command";
import { Category } from "../../domain/model/category";
import { ProductSaveCommand } from "../../domain/model/commands/product-save-command";
import { ProductImageSaveCommand } from "../../domain/model/commands/product-image-save-command";
import { Gender } from "../../domain/model/gender";

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

  public getAllProductsWithImages(
    page: number,
    take: number,
  ): Promise<Product[]> {
    return this.forHandleProducts.getAllProductsWithImages(page, take);
  }

  public getQuantityProducts(): Promise<number> {
    return this.forHandleProducts.getQuantityProducts();
  }

  public getProductsByGender(
    gender: Gender,
    page: number,
    take: number,
  ): Promise<Product[]> {
    return this.forHandleProducts.getProductsByGender(gender, page, take);
  }

  public getQuantityProductsByGender(gender: Gender): Promise<number> {
    return this.forHandleProducts.getQuantityProductsByGender(gender);
  }

  public getProductBySlug(slug: string): Promise<Product> {
    return this.forHandleProducts.getProductBySlug(slug);
  }

  public getStockByProductSlug(slug: string): Promise<number> {
    return this.forHandleProducts.getStockByProductSlug(slug);
  }
}
