import { ForPdfConversion } from "../../domain/ports/for-pdf-conversion";

export class HandlePdfConversionUseCase {
  private readonly forPdfConversion: ForPdfConversion;

  constructor(forPdfConversion: ForPdfConversion) {
    this.forPdfConversion = forPdfConversion;
  }

  public convert(html: string): Promise<Buffer> {
    return this.forPdfConversion.convert(html);
  }
}