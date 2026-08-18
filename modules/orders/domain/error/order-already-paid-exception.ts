export class OrderAlreadyPaidException extends Error {
  constructor() {
    super("La orden ya está pagada y no se puede eliminar");
  }
}