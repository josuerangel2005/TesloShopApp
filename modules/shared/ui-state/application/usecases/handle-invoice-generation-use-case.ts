import { ForInvoiceGeneration } from "../../domain/ports/for-invoice-generation";
import { InvoiceRequest } from "../../domain/model/invoice-request";

export class HandleInvoiceGenerationUseCase {
  private readonly forInvoiceGeneration: ForInvoiceGeneration;

  constructor(forInvoiceGeneration: ForInvoiceGeneration) {
    this.forInvoiceGeneration = forInvoiceGeneration;
  }

  public generateInvoice(payload: InvoiceRequest): Promise<string> {
    return this.forInvoiceGeneration.generateInvoice(payload);
  }
}