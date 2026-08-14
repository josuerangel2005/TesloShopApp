export class VerificationTokenInvalidException extends Error {
  constructor() {
    super("The verification token is invalid or has already been used");
  }
}