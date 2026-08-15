export class Address {
  private firstName: string;
  private lastName: string;
  private address: string;
  private address2: string | null;
  private postalCode: string;
  private city: string;
  private country: string;
  private phone: string;

  constructor(
    firstName: string,
    lastName: string,
    address: string,
    address2: string | null,
    postalCode: string,
    city: string,
    country: string,
    phone: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.address2 = address2;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.phone = phone;
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

  public getCountry(): string {
    return this.country;
  }

  public getPhone(): string {
    return this.phone;
  }
}
