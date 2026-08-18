export class InvoiceRequestCustomer {
  private readonly id: string;
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly address: string;
  private readonly address2: string | null;
  private readonly postalCode: string;
  private readonly city: string;
  private readonly phone: string;
  private readonly country: string;
  private readonly email: string | null;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    address: string,
    address2: string | null,
    postalCode: string,
    city: string,
    phone: string,
    country: string,
    email: string | null,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.address2 = address2;
    this.postalCode = postalCode;
    this.city = city;
    this.phone = phone;
    this.country = country;
    this.email = email;
  }

  public getId(): string {
    return this.id;
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

  public getCountry(): string {
    return this.country;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      address2: this.address2,
      postalCode: this.postalCode,
      city: this.city,
      phone: this.phone,
      country: this.country,
      email: this.email,
    };
  }
}