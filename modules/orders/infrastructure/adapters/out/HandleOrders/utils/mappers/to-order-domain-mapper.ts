import type { Prisma } from "@/generated/prisma/client";
import { Order } from "../../../../../../domain/model/order";
import { toOrderAddressDomainMapper } from "./to-order-address-domain-mapper";
import { toOrderItemDomainMapper } from "./to-order-item-domain-mapper";

type OrderWithItemsAndAddress = Prisma.OrderGetPayload<{
  include: {
    orderItems: true;
    orderAddresses: { include: { country: true } };
  };
}>;

export const toOrderDomainMapper = (orderRow: OrderWithItemsAndAddress) =>
  new Order(
    orderRow.id,
    orderRow.subTotal,
    orderRow.tax,
    orderRow.total,
    orderRow.itemsInOrder,
    orderRow.isPaid,
    orderRow.paidAt,
    orderRow.createdAt,
    orderRow.updatedAt,
    orderRow.userId,
    orderRow.orderItems.map(toOrderItemDomainMapper),
    orderRow.orderAddresses
      ? toOrderAddressDomainMapper(orderRow.orderAddresses)
      : null,
  );