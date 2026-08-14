export class UserNotExistsException extends Error {
  constructor(email: string) {
    super(`The user with the email ${email} not exists`);
  }
}
