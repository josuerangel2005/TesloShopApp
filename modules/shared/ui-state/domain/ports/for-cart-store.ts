import { CartProduct } from "../model/cart-product";
import { Size } from "../model/size";

export interface ForCartStore {
  saveProductInCart: (product: CartProduct) => void;
  updateProductQuantity: (productId: string, size: Size, quantity: number) => void;
  removeProductFromCart: (productId: string, size: Size) => void;
  subscribe: (listener: () => void) => () => void;
  getTotalProductsInCart: () => number;
  getAllProductsInCart: () => CartProduct[];
}
