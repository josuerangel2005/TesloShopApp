import { ForHashPassword } from "../../domain/ports/for-hash-password";

export class EncryptPasswordUseCase {
  private readonly forHashPassword: ForHashPassword;

  constructor(forHashPassword: ForHashPassword) {
    this.forHashPassword = forHashPassword;
  }

  public encrypt(password: string): Promise<string> {
    return this.forHashPassword.encrypt(password);
  }

  public compare(requestPassword: string, password: string): Promise<boolean> {
    return this.forHashPassword.compare(requestPassword, password);
  }
}
