export class OrderAddressSaveCommand {
  private firstName: string;
  private lastName: string;
  private address: string;
  private address2: string | null;
  private postalCode: string;
  private city: string;
  private phone: string;
  private countryId: string;

  constructor(
    firstName: string,
    lastName: string,
    address: string,
    address2: string | null,
    postalCode: string,
    city: string,
    phone: string,
    countryId: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.address2 = address2;
    this.postalCode = postalCode;
    this.city = city;
    this.phone = phone;
    this.countryId = countryId;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getAddress(): string {
    return this.address;
  }

  public getAddress2(): string | null {
    return this.address2;
  }

  public getPostalCode(): string {
    return this.postalCode;
  }

  public getCity(): string {
    return this.city;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getCountryId(): string {
    return this.countryId;
  }
}