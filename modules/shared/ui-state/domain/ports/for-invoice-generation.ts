import { InvoiceRequest } from "../model/invoice-request";

export interface ForInvoiceGeneration {
  generateInvoice: (payload: InvoiceRequest) => Promise<string>;
}