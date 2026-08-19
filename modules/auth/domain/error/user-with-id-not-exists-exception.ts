export class UserWithIdNotExistsException extends Error {
  constructor(userId: string) {
    super(`User wtih id: ${userId} not exists`);
  }
}
