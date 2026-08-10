export class CategoryWithIdNotExistsException extends Error {
  constructor(categoryId: string) {
    super(`Category with id ${categoryId} not exists`);
  }
}
