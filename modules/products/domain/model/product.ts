import { Category } from "./category";
import { Gender } from "./gender";
import { ProductImage } from "./productImage";
import { Size } from "../../../shared/ui-state/domain/model/size";

export class Product {
  private readonly id: string;
  private title: string;
  private description: string;
  private inStock: number;
  private price: number;
  private sizes: Size[];
  private slug: string;
  private tags: string[];
  private gender: Gender;
  private category: Category;
  private productImages: ProductImage[];

  constructor(
    id: string,
    title: string,
    description: string,
    inStock: number,
    price: number,
    sizes: Size[],
    slug: string,
    tags: string[],
    gender: Gender,
    category: Category,
    productImages: ProductImage[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.inStock = inStock;
    this.price = price;
    this.sizes = sizes;
    this.slug = slug;
    this.tags = tags;
    this.gender = gender;
    this.category = category;
    this.productImages = productImages;
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getInStock(): number {
    return this.inStock;
  }

  public getPrice(): number {
    return this.price;
  }

  public getSizes(): Size[] {
    return this.sizes;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public getGender(): Gender {
    return this.gender;
  }

  public getCategory(): Category {
    return this.category;
  }

  public getProductImages(): ProductImage[] {
    return this.productImages;
  }
}
