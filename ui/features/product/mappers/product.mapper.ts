import { Product } from "../../../../modules/products/domain/model/product";
import { GenderResponse } from "../interfaces/response/gender-reponse.type";
import { ProductResponse } from "../interfaces/response/product-response.interface";
import { SizeResponse } from "../interfaces/response/size-response.type";

export const productToResponse = (product: Product): ProductResponse => ({
  id: product.getId(),
  title: product.getTitle(),
  description: product.getDescription(),
  inStock: product.getInStock(),
  price: product.getPrice(),
  sizes: product.getSizes() as SizeResponse[],
  slug: product.getSlug(),
  tags: product.getTags(),
  gender: product.getGender() as GenderResponse,
  category: {
    id: product.getCategory().getId(),
    name: product.getCategory().getName(),
  },
  images: product.getProductImages().map((productImage) => ({
    id: productImage.getId(),
    url: productImage.getUrl(),
    productId: productImage.getProductId(),
  })),
});