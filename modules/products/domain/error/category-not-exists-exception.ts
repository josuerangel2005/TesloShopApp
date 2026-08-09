export class CategoryNotExistsException extends Error {
  constructor(name: string) {
    super(`Category with name ${name} not exists`);
  }
}
