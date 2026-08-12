import { CartProduct } from "../../../../domain/model/cart-product";
import { Size } from "../../../../domain/model/size";
import { ForCartStore } from "../../../../domain/ports/for-cart-store";
import { cartStore } from "./zustand-cart-adapter";

export class CartStore implements ForCartStore {
  private readonly zustandCartStore: typeof cartStore;

  constructor(zustandCartStore: typeof cartStore) {
    this.zustandCartStore = zustandCartStore;
  }

  saveProductInCart(product: CartProduct): void {
    this.zustandCartStore.getState().addProductToCart(product);
  }

  updateProductQuantity(productId: string, size: Size, quantity: number): void {
    this.zustandCartStore.getState().updateProductQuantity(productId, size, quantity);
  }

  removeProductFromCart(productId: string, size: Size): void {
    this.zustandCartStore.getState().removeProductFromCart(productId, size);
  }

  subscribe(listener: () => void): () => void {
    return this.zustandCartStore.subscribe(listener);
  }

  getTotalProductsInCart(): number {
    return this.zustandCartStore.getState().getTotalProductsInCart();
  }

  getAllProductsInCart(): CartProduct[] {
    return this.zustandCartStore.getState().getAllProductsInCart();
  }
}
