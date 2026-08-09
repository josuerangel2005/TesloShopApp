import { Product } from "./product";

export class ProductImage {
  private readonly id: number;
  private url: string;
  private product: Product;

  constructor(id: number, url: string, product: Product) {
    this.id = id;
    this.url = url;
    this.product = product;
  }

  public getId(): number {
    return this.id;
  }

  public getUrl(): string {
    return this.url;
  }

  public getProduct(): Product {
    return this.product;
  }
}
