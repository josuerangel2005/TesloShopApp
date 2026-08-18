export class InvoiceRequestItem {
  private readonly productId: string;
  private readonly title: string;
  private readonly slug: string;
  private readonly size: string;
  private readonly quantity: number;
  private readonly price: number;
  private readonly lineTotal: number;

  constructor(
    productId: string,
    title: string,
    slug: string,
    size: string,
    quantity: number,
    price: number,
    lineTotal: number,
  ) {
    this.productId = productId;
    this.title = title;
    this.slug = slug;
    this.size = size;
    this.quantity = quantity;
    this.price = price;
    this.lineTotal = lineTotal;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getSize(): string {
    return this.size;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getPrice(): number {
    return this.price;
  }

  public getLineTotal(): number {
    return this.lineTotal;
  }

  public toJSON(): Record<string, unknown> {
    return {
      productId: this.productId,
      title: this.title,
      slug: this.slug,
      size: this.size,
      quantity: this.quantity,
      price: this.price,
      lineTotal: this.lineTotal,
    };
  }
}