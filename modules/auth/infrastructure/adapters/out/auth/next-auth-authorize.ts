import { z } from "zod";
import { ForAuth } from "../../../../domain/ports/driven/for-auth";
import { InvalidCredentialsException } from "../../../../domain/error/invalid-credentials-exception";
import { UserNotExistsException } from "../../../../domain/error/user-not-exists-exception";

export class NextAuthAuthorize {
  private readonly forAuth: ForAuth;

  constructor(forAuth: ForAuth) {
    this.forAuth = forAuth;
  }

  public async execute(credentials: unknown) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const parsed = schema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;

    try {
      const user = await this.forAuth.verifyCredentials(email, password);
      return {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        image: user.getImage(),
        role: user.getRole(),
        emailVerified: user.getEmailVerified(),
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsException) return null;
      if (error instanceof UserNotExistsException) return null;
      throw error;
    }
  }
}
