import { create } from "zustand";
import { CartProduct } from "../../../../domain/model/cart-product";
import { Size } from "../../../../domain/model/size";
import { persist } from "zustand/middleware";

interface State {
  productsInCart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (productId: string, size: Size, quantity: number) => void;
  removeProductFromCart: (productId: string, size: Size) => void;
  getTotalProductsInCart: () => number;
  getAllProductsInCart: () => CartProduct[];
}

interface PersistedCartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
  inStock: number;
}

const toDomainProduct = (raw: PersistedCartProduct): CartProduct =>
  new CartProduct(
    raw.id,
    raw.slug,
    raw.title,
    raw.price,
    raw.quantity,
    raw.size,
    raw.image,
    raw.inStock,
  );

export const cartStore = create<State>()(
  persist(
    (set, get) => ({
      productsInCart: [],

      getTotalProductsInCart: () =>
        get().productsInCart.reduce((acc, item) => acc + item.getQuantity(), 0),

      getAllProductsInCart: () => get().productsInCart,

      addProductToCart: (product: CartProduct): void => {
        const { productsInCart } = get();

        // Revisar si el producto (con esa talla específica) ya existe
        const productInCart = productsInCart.some(
          (item) =>
            item.getId() === product.getId() &&
            item.getSize() === product.getSize(),
        );

        if (!productInCart) {
          set({
            productsInCart: [...productsInCart, product],
          });
          return;
        }

        const updateProducts = productsInCart.map((item) => {
          if (
            item.getId() === product.getId() &&
            item.getSize() === product.getSize()
          ) {
            return new CartProduct(
              item.getId(),
              item.getSlug(),
              item.getTitle(),
              item.getPrice(),
              item.getQuantity() + product.getQuantity(),
              item.getSize(),
              item.getImage(),
              item.getInStock(),
            );
          }

          return item;
        });

        set({
          productsInCart: updateProducts,
        });
      },

      updateProductQuantity: (productId: string, size: Size, quantity: number): void => {
        const { productsInCart } = get();

        const clamped = Math.max(quantity, 1);

        set({
          productsInCart: productsInCart.map((item) =>
            item.getId() === productId && item.getSize() === size
              ? new CartProduct(
                  item.getId(),
                  item.getSlug(),
                  item.getTitle(),
                  item.getPrice(),
                  clamped,
                  item.getSize(),
                  item.getImage(),
                  item.getInStock(),
                )
              : item,
          ),
        });
      },

      removeProductFromCart: (productId: string, size: Size): void => {
        const { productsInCart } = get();

        set({
          productsInCart: productsInCart.filter(
            (item) => !(item.getId() === productId && item.getSize() === size),
          ),
        });
      },
    }),
    {
      name: "shopping-cart",
      merge: (persisted, current) => {
        if (!persisted) return current;

        const persistedState = persisted as Partial<State>;
        const persistedProducts = (persistedState.productsInCart ??
          []) as unknown as PersistedCartProduct[];

        return {
          ...current,
          productsInCart: persistedProducts.map(toDomainProduct),
        };
      },
    },
  ),
);
