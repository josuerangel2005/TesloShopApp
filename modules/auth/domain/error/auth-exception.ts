export class AuthException extends Error {
  constructor(message: string) {
    super(`Unknown auth error: ${message}`);
  }
}
