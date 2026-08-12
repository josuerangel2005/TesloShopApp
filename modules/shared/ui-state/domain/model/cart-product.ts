import { Size } from "./size";

export class CartProduct {
  private readonly id: string;
  private slug: string;
  private title: string;
  private price: number;
  private quantity: number;
  private size: Size;
  private image: string;
  private inStock: number;

  constructor(
    id: string,
    slug: string,
    title: string,
    price: number,
    quantity: number,
    size: Size,
    image: string,
    inStock: number,
  ) {
    this.id = id;
    this.slug = slug;
    this.title = title;
    this.price = price;
    this.quantity = quantity;
    this.size = size;
    this.image = image;
    this.inStock = inStock;
  }

  public getId(): string {
    return this.id;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getTitle(): string {
    return this.title;
  }

  public getPrice(): number {
    return this.price;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getSize(): Size {
    return this.size;
  }

  public getImage(): string {
    return this.image;
  }

  public getInStock(): number {
    return this.inStock;
  }
}
