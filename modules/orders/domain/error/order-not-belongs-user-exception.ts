export class OrderNotBelongsUserException extends Error {
  constructor() {
    super("La orden no pertenece al usuario");
  }
}