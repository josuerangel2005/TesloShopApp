import { Gender } from "../gender";
import { Size } from "../../../../shared/ui-state/domain/model/size";

export class ProductSaveCommand {
  private description: string;
  private title: string;
  private inStock: number;
  private price: number;
  private sizes: Size[];
  private slug: string;
  private tags: string[];
  private gender: Gender;
  private categoryId: string;

  constructor(
    description: string,
    title: string,
    inStock: number,
    price: number,
    sizes: Size[],
    slug: string,
    tags: string[],
    gender: Gender,
    categoryId: string,
  ) {
    this.description = description;
    this.title = title;
    this.inStock = inStock;
    this.price = price;
    this.sizes = sizes;
    this.slug = slug;
    this.tags = tags;
    this.gender = gender;
    this.categoryId = categoryId;
  }

  public getDescription(): string {
    return this.description;
  }

  public getTitle(): string {
    return this.title;
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

  public getCategoryId(): string {
    return this.categoryId;
  }
}
