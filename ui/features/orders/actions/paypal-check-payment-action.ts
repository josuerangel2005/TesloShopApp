"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { PaypalOrderStatusResponse } from "../interfaces/paypal";
import { sendInvoiceEmailAction } from "./send-invoice-email-action";

export const paypalCheckPaymentAction = async (
  transactionId: string,
): Promise<{ ok: boolean; message: string }> => {
  try {
    const authToken = await getPaypalBearerToken();

    if (!authToken)
      return {
        ok: false,
        message: "Failed to get PayPal auth token",
      };

    const resp = await verifyPaypalPayment(transactionId, authToken);

    if (!resp)
      return {
        ok: false,
        message: "Failed to verify PayPal payment",
      };

    const { status, purchase_units } = resp;

    if (status !== "COMPLETED")
      return {
        ok: false,
        message: `PayPal payment status is not completed. Current status`,
      };

    const orderId = purchase_units[0]?.invoice_id;

    if (!orderId)
      return {
        ok: false,
        message: "Purchase unit is missing invoice_id",
      };

    const order = await getHandleOrdersUseCase().getOrderById(orderId);
    const session = await getHandleAuthUseCase().getSession();
    if (!session || session.getId() !== order.getUserId())
      return { ok: false, message: "Order does not belong to the authenticated user" };

    const capture = purchase_units[0]?.payments.captures[0];
    const capturedAmount = Number(capture?.amount.value);
    if (
      capture?.amount.currency_code !== "USD" ||
      Math.round(capturedAmount * 100) !== Math.round(order.getTotal() * 100)
    )
      return { ok: false, message: "Captured amount does not match the order total" };

    await updateOrderPaymentStatus(orderId);

    revalidatePath(`/orders/${orderId}`);

    after(async () => {
      const emailResult = await sendInvoiceEmailAction(orderId);
      if (emailResult && !emailResult.ok)
        console.error(`Invoice email failed for order ${orderId}:`, emailResult);
    });

    return {
      ok: true,
      message: "Payment verified and order updated successfully",
    };
  } catch (error) {
    return {
      ok: false,
      message: "Error checking PayPal payment: ",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8",
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    cache: "no-store",
  };

  try {
    const request = await fetch(
      process.env.PAYPAL_OAUTH_URL ?? "",
      requestOptions,
    );

    if (!request.ok) {
      console.log(`PayPal OAuth failed with status: ${request.status}`);
      return null;
    }

    const { access_token } = await request.json();

    return access_token;
  } catch (error) {
    console.log("Error fetching PayPal bearer token:", error);
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string,
): Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    cache: "no-store",
  };

  try {
    const request = await fetch(paypalOrderUrl, requestOptions);
    return await request.json();
  } catch (error) {
    return null;
  }
};

const updateOrderPaymentStatus = async (orderId: string): Promise<void> => {
  const handleOrdersUseCase = getHandleOrdersUseCase();
  await handleOrdersUseCase.updatePaymentStatus(orderId);
};
