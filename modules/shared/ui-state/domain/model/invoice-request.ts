import { InvoiceRequestCustomer } from "./invoice-request-customer";
import { InvoiceRequestItem } from "./invoice-request-item";

export class InvoiceRequest {
  private readonly id: string | undefined;
  private readonly orderId: string;
  private readonly number: string;
  private readonly issuedAt: string | null;
  private readonly paidAt: string | null | undefined;
  private readonly customer: InvoiceRequestCustomer;
  private readonly items: InvoiceRequestItem[];
  private readonly subTotal: number;
  private readonly tax: number;
  private readonly total: number;

  constructor(
    orderId: string,
    number: string,
    issuedAt: string | null,
    customer: InvoiceRequestCustomer,
    items: InvoiceRequestItem[],
    subTotal: number,
    tax: number,
    total: number,
    id?: string,
    paidAt?: string | null,
  ) {
    this.orderId = orderId;
    this.number = number;
    this.issuedAt = issuedAt;
    this.customer = customer;
    this.items = items;
    this.subTotal = subTotal;
    this.tax = tax;
    this.total = total;
    this.id = id;
    this.paidAt = paidAt;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getNumber(): string {
    return this.number;
  }

  public getIssuedAt(): string | null {
    return this.issuedAt;
  }

  public getPaidAt(): string | null | undefined {
    return this.paidAt;
  }

  public getCustomer(): InvoiceRequestCustomer {
    return this.customer;
  }

  public getItems(): InvoiceRequestItem[] {
    return this.items;
  }

  public getSubTotal(): number {
    return this.subTotal;
  }

  public getTax(): number {
    return this.tax;
  }

  public getTotal(): number {
    return this.total;
  }

  public toJSON(): Record<string, unknown> {
    return {
      ...(this.id !== undefined ? { id: this.id } : {}),
      orderId: this.orderId,
      number: this.number,
      issuedAt: this.issuedAt,
      ...(this.paidAt !== undefined ? { paidAt: this.paidAt } : {}),
      customer: this.customer.toJSON(),
      items: this.items.map((item) => item.toJSON()),
      subTotal: this.subTotal,
      tax: this.tax,
      total: this.total,
    };
  }
}