export interface ProductAdminResponse {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  sizes: string[];
  gender: string;
  category: string;
  inStock: number;
}