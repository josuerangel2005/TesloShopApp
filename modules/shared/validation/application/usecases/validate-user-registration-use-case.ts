import { emailSchema, nameSchema, passwordSchema } from "../../domain/model/schemas";
import { ValidationResult } from "../../domain/model/validation-result";

export class ValidateUserRegistrationUseCase {
  public validate(
    name: string,
    email: string,
    password: string,
  ): ValidationResult {
    const nameError = this.validateName(name);
    const emailError = this.validateEmail(email);
    const passwordError = this.validatePassword(password);

    if (nameError || emailError || passwordError) {
      return {
        success: false,
        fieldErrors: {
          name: nameError,
          email: emailError,
          password: passwordError,
        },
      };
    }

    return { success: true };
  }

  public validateName(name: string): string | undefined {
    const result = nameSchema.safeParse(name);
    return result.success ? undefined : result.error.issues[0]?.message;
  }

  public validateEmail(email: string): string | undefined {
    const result = emailSchema.safeParse(email);
    return result.success ? undefined : result.error.issues[0]?.message;
  }

  public validatePassword(password: string): string | undefined {
    const result = passwordSchema.safeParse(password);
    return result.success ? undefined : result.error.issues[0]?.message;
  }
}
