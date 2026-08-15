import { ForPdfConversion } from "../../../../domain/ports/for-pdf-conversion";

export class PdfShiftDocumentConverterAdapter implements ForPdfConversion {
  async convert(html: string): Promise<Buffer> {
    const apiKey = process.env.PDFSHIFT_API_KEY;
    if (!apiKey) {
      throw new Error("PDFSHIFT_API_KEY no está configurada.");
    }

    const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        source: html,
        format: "A4",
        use_print: true,
        sandbox: process.env.NODE_ENV !== "production",
      }),
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const responseBody = await response.json();
        errorMessage = responseBody.error ?? errorMessage;
      } catch {
        // Keep the status text if the error body is not parseable JSON.
      }
      throw new Error("PDFShift error " + response.status + ": " + errorMessage);
    }

    return Buffer.from(await response.arrayBuffer());
  }
}