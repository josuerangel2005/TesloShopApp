import { HandleProductsInCartUseCase } from "../../../application/usecases/handle-products-in-cart-use-case";
import { CartStore } from "../../adapters/out/CartState/cart-store";
import { cartStore } from "../../adapters/out/CartState/zustand-cart-adapter";

const cartStoreClass = new CartStore(cartStore);

export const getHandleProductsInCartUseCase = () =>
  new HandleProductsInCartUseCase(cartStoreClass);
