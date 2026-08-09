import { Product } from "../../domain/model/product";
import { ForHandleProducts } from "../../domain/ports/drivens/for-handle-products";

export class HandleProductsUseCase {
  private readonly forHandleProducts: ForHandleProducts;

  constructor(forHandleProducts: ForHandleProducts) {
    this.forHandleProducts = forHandleProducts;
  }

  public findAll(): Promise<Product> {
    return this.forHandleProducts.findAll();
  }
}
