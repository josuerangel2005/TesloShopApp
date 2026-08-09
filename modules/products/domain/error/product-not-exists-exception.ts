export class ProductNotExistsException extends Error {
  constructor(slug: string) {
    super(`The product with the slug ${slug} not exists`);
  }
}
