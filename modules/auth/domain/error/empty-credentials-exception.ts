export class EmptyCredentialExcepion extends Error {
  constructor() {
    super("The credentials are empty");
  }
}
