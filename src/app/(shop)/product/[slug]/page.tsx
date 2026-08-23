export const revalidate = 604800; // 7 días

import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";
import {
  ProductDetails,
  ProductMobileSlideshow,
  ProductSlideshow,
} from "../../../../../ui/features/product";
import { getProductBySlug } from "../../../../../ui/features/product/actions/get-product-by-slug";
import { StockLabel } from "../../../../../ui/features/product/components/stock-label/StockLabel";
import { Metadata, ResolvingMetadata } from "next";
import { getHandleAuthUseCase } from "../../../../../modules/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? "Porducto no encontrado",
    description: product.description ?? "",
    openGraph: {
      title: product?.title ?? "Porducto no encontrado",
      description: product.description ?? "",
      images: [`/products/${product.images[1].url}`],
    },
  };
}

export default async function ({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const user = await getHandleAuthUseCase().getSession();

  if (!product) notFound();

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">
        <ProductMobileSlideshow
          title={product.title}
          images={product.images.map((img) => img.url)}
          className="block md:hidden"
        />

        <ProductSlideshow
          title={product.title}
          images={product.images.map((img) => img.url)}
          className="hidden md:block"
        />
      </div>

      {/* details */}
      <div className="col-span-1">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <nav
            aria-label="Breadcrumb"
            className="text-xs uppercase tracking-wide text-slate-400"
          >
            Inicio / <span className="capitalize">{product.gender}</span>
          </nav>

          <StockLabel slug={product.slug} />

          <h1
            className={`${titleFont.className} antialiased mt-3 text-2xl font-semibold text-slate-800`}
          >
            {product.title}
          </h1>

          <p className="my-4 text-2xl font-bold text-slate-900">
            {usd.format(product.price)}
          </p>

          <ProductDetails product={product} role={user?.getRole()} />

          <div className="mt-8">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-700">
              Descripción
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
