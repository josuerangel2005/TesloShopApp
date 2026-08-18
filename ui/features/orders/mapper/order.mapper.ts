import { Order as DomainOrder } from "../../../../modules/orders/domain/model/order";
import { Order } from "../interfaces/order";
import { orderAddressToOrderAddress } from "./order-address.mapper";
import { orderItemToOrderItem } from "./order-item.mapper";

export const orderToOrder = (order: DomainOrder): Order => ({
  id: order.getId(),
  subTotal: order.getSubTotal(),
  tax: order.getTax(),
  total: order.getTotal(),
  itemsInOrder: order.getItemsInOrder(),
  isPaid: order.getIsPaid(),
  paidAt: order.getPaidAt()?.toISOString() ?? null,
  createdAt: order.getCreatedAt().toISOString(),
  updatedAt: order.getUpdatedAt().toISOString(),
  userId: order.getUserId(),
  orderItems: order.getOrderItems().map(orderItemToOrderItem),
  orderAddress: order.getOrderAddress()
    ? orderAddressToOrderAddress(order.getOrderAddress()!)
    : null,
});
