import { Role } from "../role";

export class UserSaveCommand {
  private name: string;
  private email: string;
  private password: string;
  private role: Role;
  private image: string;

  constructor(
    name: string,
    email: string,
    password: string,
    role: Role,
    image: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.image = image;
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
}
