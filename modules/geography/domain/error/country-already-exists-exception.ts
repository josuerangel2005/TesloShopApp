export class CountryAlreadyExistsException extends Error {
  constructor(name: string, countryId: string) {
    super(
      `Country with name: ${name} or countryId: ${countryId} already exists`,
    );
  }
}
