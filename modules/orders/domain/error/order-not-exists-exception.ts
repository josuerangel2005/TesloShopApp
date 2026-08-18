export class OrderNotExistsException extends Error {
  constructor(userId: string) {
    super(`Order with user id ${userId} not exists`);
  }
}
