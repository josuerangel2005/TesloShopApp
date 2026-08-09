export class ProductAlreadyExistsException extends Error {
  constructor(slug: string) {
    super(`The product with the slug ${slug} already exists`);
  }
}
