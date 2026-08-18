"use server";

import { getOrderByIdAction } from "./get-order-by-id-action";
import { getProductsByIdsAction } from "./get-products-by-ids-action";
import { Order } from "../interfaces/order";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleInvoiceGenerationUseCase } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-invoice-generation-use-case-factory";
import { getEmailSenderHandlerUseCase } from "../../../../modules/email/infrastructure/config/factory/email-sender-handler-use-case-factory";
import { invoiceEmail } from "../../../../modules/email/infrastructure/templates/invoice-email";
import { InvoiceRequest } from "../../../../modules/shared/ui-state/domain/model/invoice-request";
import { InvoiceRequestCustomer } from "../../../../modules/shared/ui-state/domain/model/invoice-request-customer";
import { InvoiceRequestItem } from "../../../../modules/shared/ui-state/domain/model/invoice-request-item";

export type SendInvoiceEmailActionResult =
  | { ok: true }
  | { ok: false; kind: "user"; message: string }
  | { ok: false; kind: "system" };

export const sendInvoiceEmailAction = async (
  orderId: string,
): Promise<SendInvoiceEmailActionResult> => {
  try {
    const order: Order = await getOrderByIdAction(orderId);

    if (!order.orderAddress) {
      return {
        ok: false,
        kind: "user",
        message: "La orden no tiene una dirección de facturación asociada.",
      };
    }

    const handleAuth = getHandleAuthUseCase();
    const session = await handleAuth.getSession();

    if (!session?.getEmail()) {
      return {
        ok: false,
        kind: "user",
        message: "Debes iniciar sesión para recibir la factura por correo.",
      };
    }

    const orderItems: Order["orderItems"] = order.orderItems;
    const products = await getProductsByIdsAction(
      orderItems.map((item) => item.productId),
    );
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const items: InvoiceRequestItem[] = orderItems.map((item) => {
      const product = productsById.get(item.productId);

      return new InvoiceRequestItem(
        item.productId,
        product?.title ?? "Producto",
        product?.slug ?? item.productId,
        item.size,
        item.quantity,
        item.price,
        item.price * item.quantity,
      );
    });

    const customer: InvoiceRequestCustomer = new InvoiceRequestCustomer(
      order.userId,
      order.orderAddress.firstName,
      order.orderAddress.lastName,
      order.orderAddress.address,
      order.orderAddress.address2,
      order.orderAddress.postalCode,
      order.orderAddress.city,
      order.orderAddress.phone,
      order.orderAddress.countryId,
      session.getEmail(),
    );

    const invoiceNumber = `F-${order.id.slice(-8).toUpperCase()}`;

    const invoiceRequest: InvoiceRequest = new InvoiceRequest(
      order.id,
      invoiceNumber,
      order.createdAt,
      customer,
      items,
      order.subTotal,
      order.tax,
      order.total,
      invoiceNumber,
      order.paidAt ?? null,
    );

    const invoiceUrl =
      await getHandleInvoiceGenerationUseCase().generateInvoice(invoiceRequest);

    const message = invoiceEmail(session.getEmail(), invoiceNumber, invoiceUrl);

    await getEmailSenderHandlerUseCase().send(message);

    return { ok: true };
  } catch (error) {
    console.error("Error al enviar la factura por email:", error);
    return { ok: false, kind: "system" };
  }
};
