import { Role } from "./role";

export class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private role: Role;
  private image: string;
  private readonly emailVerified: Date | null;
  private readonly emailVerificationToken: string | null;
  private readonly emailVerificationExpires: Date | null;

  constructor(
    id: string,
    name: string,
    email: string,
    role: Role,
    image: string,
    emailVerified: Date | null,
    emailVerificationToken: string | null,
    emailVerificationExpires: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.image = image;
    this.emailVerified = emailVerified;
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationExpires = emailVerificationExpires;
  }

  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getRole(): Role {
    return this.role;
  }
  public getImage(): string {
    return this.image;
  }
  public getEmailVerified(): Date | null {
    return this.emailVerified;
  }
  public getEmailVerificationToken(): string | null {
    return this.emailVerificationToken;
  }
  public getEmailVerificationExpires(): Date | null {
    return this.emailVerificationExpires;
  }
}
