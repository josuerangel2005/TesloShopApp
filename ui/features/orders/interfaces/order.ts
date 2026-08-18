import { OrderAddress } from "./order-address";
import { OrderItem } from "./order-item";

export interface Order {
  id: string;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  orderItems: OrderItem[];
  orderAddress: OrderAddress | null;
}