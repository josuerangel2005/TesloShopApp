export class ProductQuantityZeroException extends Error {
  constructor(productTitle: string) {
    super(`The product ${productTitle} cannot have a quantity of 0.`);
  }
}
