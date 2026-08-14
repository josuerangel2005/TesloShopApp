import { compare, hash } from "bcryptjs";
import { ForHashPassword } from "../../../../domain/ports/for-hash-password";

export class BcryptValidatorAdapter implements ForHashPassword {
  async encrypt(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async compare(requestPassword: string, password: string): Promise<boolean> {
    return await compare(requestPassword, password);
  }
}
