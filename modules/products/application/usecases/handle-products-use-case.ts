import { Product } from "../../domain/model/product";
import { ForHandleProducts } from "../../domain/ports/drivens/for-handle-products";
import { CategorySaveCommand } from "../../domain/model/commands/category-save-command";
import { Category } from "../../domain/model/category";
import { ProductSaveCommand } from "../../domain/model/commands/product-save-command";
import { ProductImageSaveCommand } from "../../domain/model/commands/product-image-save-command";
import { Gender } from "../../domain/model/gender";
import { ImageUpload } from "../../../shared/ui-state/domain/model/image-upload";

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
    search: string,
  ): Promise<Product[]> {
    return this.forHandleProducts.getAllProductsWithImages(page, take, search);
  }

  public getQuantityProducts(search: string): Promise<number> {
    return this.forHandleProducts.getQuantityProducts(search);
  }

  public getProductsByGender(
    gender: Gender,
    page: number,
    take: number,
    search: string,
  ): Promise<Product[]> {
    return this.forHandleProducts.getProductsByGender(
      gender,
      page,
      take,
      search,
    );
  }

  public getQuantityProductsByGender(
    gender: Gender,
    search: string,
  ): Promise<number> {
    return this.forHandleProducts.getQuantityProductsByGender(gender, search);
  }

  public getProductBySlug(slug: string): Promise<Product> {
    return this.forHandleProducts.getProductBySlug(slug);
  }

  public getProductsByIds(ids: string[]): Promise<Product[]> {
    return this.forHandleProducts.getProductsByIds(ids);
  }

  public getStockByProductSlug(slug: string): Promise<number> {
    return this.forHandleProducts.getStockByProductSlug(slug);
  }

  public getAllCategories(): Promise<Category[]> {
    return this.forHandleProducts.getAllCategories();
  }

  public saveProduct(
    productSave: ProductSaveCommand,
    imagesUpload: ImageUpload[],
  ): Promise<void> {
    return this.forHandleProducts.saveProduct(productSave, imagesUpload);
  }

  public deleteProductById(productId: string): Promise<void> {
    return this.forHandleProducts.deleteProductById(productId);
  }

  public updateProduct(
    productSave: ProductSaveCommand,
    imagesUpload: ImageUpload[],
    productId: string,
    initialImages: string[],
  ): Promise<void> {
    return this.forHandleProducts.updateProduct(
      productSave,
      imagesUpload,
      productId,
      initialImages,
    );
  }
}
