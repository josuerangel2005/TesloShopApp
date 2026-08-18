import { ForInvoiceGeneration } from "../../../../domain/ports/for-invoice-generation";
import { InvoiceRequest } from "../../../../domain/model/invoice-request";

export class SpringInvoiceGenerationAdapter implements ForInvoiceGeneration {
  private readonly timeoutMs = 120_000;

  async generateInvoice(payload: InvoiceRequest): Promise<string> {
    const billingApiUrl = process.env.BILLING_API_URL;
    if (!billingApiUrl) {
      throw new Error("BILLING_API_URL no está configurada.");
    }

    const endpoint = `${billingApiUrl.replace(/\/$/, "")}/generate/billing`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const responseBody = await response.json();
          errorMessage =
            responseBody.error ?? responseBody.message ?? errorMessage;
        } catch {}
        throw new Error(
          "Billing API error " + response.status + ": " + errorMessage,
        );
      }

      const rawBody = (await response.text()).trim();
      let invoiceUrl = rawBody;

      if (rawBody.startsWith("{") || rawBody.startsWith("[")) {
        try {
          const parsed = JSON.parse(rawBody);
          if (typeof parsed === "string") {
            invoiceUrl = parsed.trim();
          } else if (
            parsed &&
            typeof parsed === "object" &&
            typeof parsed.url === "string"
          ) {
            invoiceUrl = parsed.url.trim();
          } else {
            invoiceUrl = "";
          }
        } catch {}
      }

      if (!invoiceUrl) {
        throw new Error("Billing API devolvió una respuesta sin URL de PDF.");
      }

      return invoiceUrl;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          "Billing API timeout: la petición superó los " +
            this.timeoutMs / 1000 +
            " segundos.",
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
