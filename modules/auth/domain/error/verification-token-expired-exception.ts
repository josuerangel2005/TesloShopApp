export class VerificationTokenExpiredException extends Error {
  constructor() {
    super("The verification token has expired");
  }
}