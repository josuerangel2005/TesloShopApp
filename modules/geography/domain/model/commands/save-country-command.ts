export class SaveCountryCommand {
  private name: string;
  private countryId: string;

  constructor(name: string, countryId: string) {
    this.name = name;
    this.countryId = countryId;
  }

  public getName(): string {
    return this.name;
  }

  public getCountryId(): string {
    return this.countryId;
  }
}
