import { Size } from "../../../../modules/shared/ui-state/domain/model/size";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: Size;
  orderId: string;
  productId: string;
}