import { SizeResponse, GenderResponse } from "../../../product";
import { CategoryResponse } from "./category-response";

export interface ProductFormResponse {
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
  images: string[];
}
