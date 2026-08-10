import { ProductResponse } from "../../product/interfaces/response/product-response.interface";
import { ProductGridItem } from "./ProductGridItem";

interface Props {
  products: ProductResponse[];
}

export const ProductsGrid = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 mb-10">
      {products.map((product, index) => (
        <div
          key={product.slug}
          className="product-reveal"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <ProductGridItem product={product} />
        </div>
      ))}

      <style>{`
        .product-reveal {
          opacity: 0;
          animation: productReveal 0.5s ease-out both;
        }
        @keyframes productReveal {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .product-reveal {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
