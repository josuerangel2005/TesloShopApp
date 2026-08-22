export interface ValidationResult {
  success: boolean;
  fieldErrors?: {
    title?: string;
    slug?: string;
    description?: string;
    price?: string;
    tags?: string;
    gender?: string;
    category?: string;
    sizes?: string;
    imagesQuantity?: string;
    inStock?: string;
  };
}
