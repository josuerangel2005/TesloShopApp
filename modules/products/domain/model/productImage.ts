export class ProductImage {
  private readonly id: number;
  private url: string;
  private productId: string;

  constructor(id: number, url: string, productId: string) {
    this.id = id;
    this.url = url;
    this.productId = productId;
  }

  public getId(): number {
    return this.id;
  }

  public getUrl(): string {
    return this.url;
  }

  public getProductId(): string {
    return this.productId;
  }
}
