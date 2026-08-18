import { CartProduct } from "../../domain/model/cart-product";
import { Size } from "../../domain/model/size";
import { ForCartStore } from "../../domain/ports/for-cart-store";

export class HandleProductsInCartUseCase {
  private readonly forCartStore: ForCartStore;

  constructor(forCartStore: ForCartStore) {
    this.forCartStore = forCartStore;
  }

  public saveProductInCart(product: CartProduct): void {
    this.forCartStore.saveProductInCart(product);
  }

  public updateProductQuantity(
    productId: string,
    size: Size,
    quantity: number,
  ): void {
    this.forCartStore.updateProductQuantity(productId, size, quantity);
  }

  public removeProductFromCart(productId: string, size: Size): void {
    this.forCartStore.removeProductFromCart(productId, size);
  }

  public subscribe(listener: () => void): () => void {
    return this.forCartStore.subscribe(listener);
  }

  public getTotalProductsInCart(): number {
    return this.forCartStore.getTotalProductsInCart();
  }

  public getAllProductsInCart(): CartProduct[] {
    return this.forCartStore.getAllProductsInCart();
  }

  public removeAllProductsInCart(): void {
    return this.forCartStore.removeAllProductsInCart();
  }
}
