import { OrderItem as DomainOrderItem } from "../../../../modules/orders/domain/model/order-item";
import { OrderItem } from "../interfaces/order-item";

export const orderItemToOrderItem = (
  orderItem: DomainOrderItem,
): OrderItem => ({
  id: orderItem.getId(),
  quantity: orderItem.getQuantity(),
  price: orderItem.getPrice(),
  size: orderItem.getSize(),
  orderId: orderItem.getOrderId(),
  productId: orderItem.getProductId(),
});
