import Link from "next/link";
import { Product } from "../../product/interfaces/product.interface";
import { ProductGridImage } from "./ProductGridImage";

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
    >
      <ProductGridImage
        src={`/products/${product.images[0]}`}
        alt={product.title}
        hoverSrc={`/products/${product.images[1]}`}
        hoverAlt={`${product.title} - vista alternativa`}
      />

      <div className="mt-3 px-0.5">
        <p className="truncate text-sm text-slate-700 transition-colors group-hover:text-slate-900">
          {product.title}
        </p>
        <p className="text-sm font-semibold text-slate-900">${product.price}</p>
      </div>
    </Link>
  );
};
