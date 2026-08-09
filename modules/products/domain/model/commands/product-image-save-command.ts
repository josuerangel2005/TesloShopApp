export class ProductImageSaveCommand {
  private url: string;
  private productId: string;

  constructor(url: string, productId: string) {
    this.url = url;
    this.productId = productId;
  }

  public getUrl(): string {
    return this.url;
  }

  public getProductId(): string {
    return this.productId;
  }
}
