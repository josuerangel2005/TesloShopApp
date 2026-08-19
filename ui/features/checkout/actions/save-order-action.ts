"use server";

import { redirect } from "next/navigation";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { CheckoutAddress } from "../interface/checkout-address";
import { CheckoutCartProduct } from "../interface/checkout-cart-product";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { OrderSaveCommand } from "../../../../modules/orders/domain/model/commands/order-save-command";
import { OrderItemSaveCommand } from "../../../../modules/orders/domain/model/commands/order-item-save-command";
import { OrderAddressSaveCommand } from "../../../../modules/orders/domain/model/commands/order-address-save-command";
import { ProductQuantityZeroException } from "../../../../modules/orders/domain/error/product-quantity-zero-exception";
import { ProductInStockZeroException } from "../../../../modules/orders/domain/error/product-in-stock-zero-exception";
import { ProductNotExistsException } from "../../../../modules/orders/domain/error/product-not-exists-exception";
import { PersisteOrderErrorException } from "../../../../modules/orders/domain/error/persistence-order-error-exception";

export type SaveOrderActionResult =
  | { ok: true; orderId: string }
  | { ok: false; kind: "user"; message: string }
  | { ok: false; kind: "system" };

export const saveOrderAction = async (
  address: CheckoutAddress,
  cart: CheckoutCartProduct[],
): Promise<SaveOrderActionResult> => {
  const handleAuthUseCase = getHandleAuthUseCase();
  const handleOrdersUseCase = getHandleOrdersUseCase();

  const user = await handleAuthUseCase.getSession();

  if (!user) {
    return {
      ok: false,
      kind: "user",
      message: "Debes iniciar sesión para realizar una compra.",
    };
  }

  if (
    cart.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)
  )
    return {
      ok: false,
      kind: "user",
      message: "Product quantities must be positive integers.",
    };

  const orderItems: OrderItemSaveCommand[] = cart.map(
    (productInCart) =>
      new OrderItemSaveCommand(
        productInCart.id,
        productInCart.quantity,
        productInCart.size,
      ),
  );
  const orderAddress: OrderAddressSaveCommand = new OrderAddressSaveCommand(
    address.firstName,
    address.lastName,
    address.address,
    address.address2,
    address.postalCode,
    address.city,
    address.phone,
    address.country,
  );

  let orderId: string;

  try {
    orderId = await handleOrdersUseCase.saveOrder(
      new OrderSaveCommand(user.getId(), orderItems, orderAddress),
    );

    return { ok: true, orderId };
  } catch (error) {
    if (error instanceof ProductQuantityZeroException) {
      return { ok: false, kind: "user", message: error.message };
    }

    if (error instanceof ProductInStockZeroException) {
      return { ok: false, kind: "user", message: error.message };
    }

    if (error instanceof ProductNotExistsException) {
      return { ok: false, kind: "user", message: error.message };
    }

    if (error instanceof PersisteOrderErrorException) {
      console.error("Error al persistir la orden:", error.message);
      return { ok: false, kind: "system" };
    }

    console.error("Error inesperado al guardar la orden:", error);
    return { ok: false, kind: "system" };
  }
};
