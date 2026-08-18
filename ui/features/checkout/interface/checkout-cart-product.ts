import { Size } from "../../../../modules/shared/ui-state/domain/model/size";

export interface CheckoutCartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
  inStock: number;
}