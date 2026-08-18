export class ProductInStockZeroException extends Error {
  constructor(productTitle: string) {
    super(`El producto ${productTitle} no tiene stock`);
  }
}
