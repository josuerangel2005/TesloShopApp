"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { setTransactionIdAction } from "../actions/set-transaction-id-action";
import { paypalCheckPaymentAction } from "../actions/paypal-check-payment-action";
import { getHandleProductsInCartUseCase } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-products-in-cart-use-case-factory";
import { getHandlePendingNumberOrdersFactory } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-pending-number-orders-factory";

interface Props {
  orderId: string;
  amount: number;
}

export const PayOrderButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-13 bg-gray-300 rounded" />
        <div className="h-13 bg-gray-300 rounded mt-2" />
        <div className="h-4 bg-gray-300 rounded mt-2" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions,
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: "USD",
            value: `${roundedAmount}`,
          },
        },
      ],
    });

    await setTransactionIdAction(orderId, transactionId);

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    const handleProductsInCartUseCase = getHandleProductsInCartUseCase();
    const handlePendingNumberOrdes = getHandlePendingNumberOrdersFactory();

    if (!details) return;

    const result = await paypalCheckPaymentAction(details.id ?? "");

    if (result.ok) {
      handleProductsInCartUseCase.removeAllProductsInCart();
      handlePendingNumberOrdes.deletePendingOrder();
    }
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
