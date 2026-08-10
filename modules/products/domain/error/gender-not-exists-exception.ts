export class GenderNotExistsException extends Error {
  constructor(gender: string) {
    super(`Gender with name ${gender} not exists`);
  }
}
