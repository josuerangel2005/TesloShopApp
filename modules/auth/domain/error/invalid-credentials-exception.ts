export class InvalidCredentialsException extends Error {
  constructor() {
    super("Email or password are incorrect");
  }
}
