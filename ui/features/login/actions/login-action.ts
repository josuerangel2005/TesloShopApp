"use server";
import { InvalidCredentialsException } from "../../../../modules/auth/domain/error/invalid-credentials-exception";
import { AuthException } from "../../../../modules/auth/domain/error/auth-exception";
import { LoginCredential } from "../../../../modules/auth/domain/model/login-credentials";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { redirect } from "next/navigation";
import { getValidateUserRegistrationUseCase } from "../../../../modules/shared/validation";

export interface LoginState {
  message?: string;
  fieldsErrors: {
    email?: string;
    password?: string;
  };
}

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const handleAuthUseCase = getHandleAuthUseCase();
  const email: string = formData.get("email")?.toString().trim() ?? "";
  const password: string = formData.get("password")?.toString().trim() ?? "";

  const validateUserRegistrationUseCase = getValidateUserRegistrationUseCase();

  if (
    validateUserRegistrationUseCase.validateEmail(email) ||
    validateUserRegistrationUseCase.validatePassword(password)
  )
    return {
      fieldsErrors: {
        email: validateUserRegistrationUseCase.validateEmail(email),
        password: validateUserRegistrationUseCase.validatePassword(password),
      },
    };
  try {
    await handleAuthUseCase.login(new LoginCredential(email, password));
  } catch (error) {
    if (error instanceof InvalidCredentialsException) {
      return {
        fieldsErrors: {},
        message: "Correo o contraseña incorrectos.",
      };
    }
    if (error instanceof AuthException) {
      return {
        fieldsErrors: {},
        message: "Error al iniciar sesión. Intente nuevamente.",
      };
    }
    console.error("Login error:", error);
    return {
      fieldsErrors: {},
      message: "Ocurrió un error inesperado. Intente nuevamente.",
    };
  }

  redirect("/");
}
