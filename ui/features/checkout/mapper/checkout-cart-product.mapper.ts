import { CartProduct } from "../../../../modules/shared/ui-state/domain/model/cart-product";
import { CheckoutCartProduct } from "../interface/checkout-cart-product";

export const cartProductToCheckoutCartProduct = (
  product: CartProduct,
): CheckoutCartProduct => ({
  id: product.getId(),
  slug: product.getSlug(),
  title: product.getTitle(),
  price: product.getPrice(),
  quantity: product.getQuantity(),
  size: product.getSize(),
  image: product.getImage(),
  inStock: product.getInStock(),
});

export const cartProductsToCheckoutCartProducts = (
  products: CartProduct[],
): CheckoutCartProduct[] => products.map(cartProductToCheckoutCartProduct);