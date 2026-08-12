"use client";

import { useState } from "react";
import { SizeSelector } from "../size-selector/SizeSelector";
import { QuantitySelector } from "../quantity-selector/QuantitySelector";
import { ProductResponse } from "../../interfaces/response/product-response.interface";
import { getHandleProductsInCartUseCase } from "../../../../../modules/shared/ui-state/infrastructure/config/factory/handle-products-in-cart-use-case-factory";
import { CartProduct } from "../../../../../modules/shared/ui-state/domain/model/cart-product";
import { Size } from "../../../../../modules/shared/ui-state/domain/model/size";

interface Props {
  product: ProductResponse;
}

export const ProductDetails = ({ product }: Props) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    (product.sizes[0] as Size) ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  const addToCard = () => {
    const handleProductsInCartUseCase = getHandleProductsInCartUseCase();
    const cartProduct: CartProduct = new CartProduct(
      product.id,
      product.slug,
      product.title,
      product.price,
      quantity,
      selectedSize!,
      product.images[1].url,
      product.inStock,
    );

    handleProductsInCartUseCase.saveProductInCart(cartProduct);
  };

  return (
    <div className="mt-5">
      <SizeSelector
        selectedSize={selectedSize ?? undefined}
        availableSizes={product.sizes as Size[]}
        onSizeChange={setSelectedSize}
      />

      <div className="mt-6">
        <h3 className="mb-3 font-medium text-sm uppercase tracking-wide text-slate-500">
          Cantidad
        </h3>
        <QuantitySelector
          quantity={quantity}
          max={Math.max(product.inStock, 1)}
          onQuantityChange={setQuantity}
        />
      </div>

      <button
        disabled={product.inStock < 1}
        type="button"
        onClick={() => addToCard()}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.inStock < 1 ? "Agotado" : "Agregar al carrito"}
      </button>
    </div>
  );
};
