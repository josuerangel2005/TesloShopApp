export class CategoryAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`The category with name ${name} already exists`);
  }
}
