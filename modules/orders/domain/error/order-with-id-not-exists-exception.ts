export class OrderWithIdNotExistsException extends Error {
  constructor(orderId: string) {
    super(`Order with id: ${orderId} not exists`);
  }
}
