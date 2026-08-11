"use client";

import { useState } from "react";
import { Product, ValidSizes } from "../../interfaces/product.interface";
import { SizeSelector } from "../size-selector/SizeSelector";
import { QuantitySelector } from "../quantity-selector/QuantitySelector";
import { ProductResponse } from "../../interfaces/response/product-response.interface";

interface Props {
  product: ProductResponse;
}

export const ProductDetails = ({ product }: Props) => {
  const [selectedSize, setSelectedSize] = useState<ValidSizes | null>(
    product.sizes[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mt-5">
      <SizeSelector
        selectedSize={selectedSize ?? undefined}
        availableSizes={product.sizes}
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
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.inStock < 1 ? "Agotado" : "Agregar al carrito"}
      </button>
    </div>
  );
};
