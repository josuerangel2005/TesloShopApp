import { CategoryResponse } from "./category-response.interface";
import { GenderResponse } from "./gender-reponse.type";
import { ProductImageResponse } from "./product-image-response.interface";
import { SizeResponse } from "./size-response.type";

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  inStock: number;
  price: number;
  sizes: SizeResponse[];
  slug: string;
  tags: string[];
  gender: GenderResponse;
  category: CategoryResponse;
  images: ProductImageResponse[];
}
