export class ProductNotExistsException extends Error {
  constructor(productId: string) {
    super(`El producto ${productId} ya no está disponible`);
  }
}