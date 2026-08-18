import type { Prisma } from "@/generated/prisma/client";
import { OrderItem } from "../../../../../../domain/model/order-item";
import { Size } from "../../../../../../../shared/ui-state/domain/model/size";

export const toOrderItemDomainMapper = (
  orderItemRow: Prisma.OrderItemGetPayload<{}>,
) =>
  new OrderItem(
    orderItemRow.id,
    orderItemRow.quantity,
    orderItemRow.price,
    orderItemRow.size as Size,
    orderItemRow.orderId,
    orderItemRow.productId,
  );