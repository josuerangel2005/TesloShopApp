export class ProductImageNotExistsException extends Error {
  constructor(productId: string) {
    super(`The image with the product id ${productId} not exists`);
  }
}
