export class Country {
  private readonly id: number;
  private name: string;
  private countryId: string;

  constructor(id: number, name: string, countryId: string) {
    this.id = id;
    this.name = name;
    this.countryId = countryId;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getCountryId(): string {
    return this.countryId;
  }
}
