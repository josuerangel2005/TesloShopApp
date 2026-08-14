import { Role } from "../role";

export class UserSeedSaveCommand {
  private name: string;
  private email: string;
  private password: string;
  private role: Role;
  private image: string;
  private emailVerified: Date | null;
  private emailVerificationToken: string | null;
  private emailVerificationExpires: Date | null;

  constructor(
    name: string,
    email: string,
    password: string,
    role: Role,
    image: string,
    emailVerified: Date | null,
    emailVerificationToken: string | null,
    emailVerificationExpires: Date | null,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.image = image;
    this.emailVerified = emailVerified;
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationExpires = emailVerificationExpires;
  }

  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
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
