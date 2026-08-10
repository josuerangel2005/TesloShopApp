export class CategoryNotExistsException extends Error {
  constructor(categoryId: string) {
    super(`Category with id ${categoryId} not exists`);
  }
}
