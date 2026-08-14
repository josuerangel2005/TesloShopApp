"use server";

import { EmptyCredentialExcepion } from "../../../../modules/auth/domain/error/empty-credentials-exception";
import { InvalidCredentialsException } from "../../../../modules/auth/domain/error/invalid-credentials-exception";
import { AuthException } from "../../../../modules/auth/domain/error/auth-exception";
import { LoginCredential } from "../../../../modules/auth/domain/model/login-credentials";
import { getHandleAuthUseCase } from "../../../../modules/auth/infrastructure/config/factory/handle-auth-use-case-factory";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  const handleAuthUseCase = getHandleAuthUseCase();

  const email: string = formData.get("email")?.toString().trim() ?? "";
  const password: string = formData.get("password")?.toString().trim() ?? "";

  try {
    if (!email || !password) throw new EmptyCredentialExcepion();

    await handleAuthUseCase.login(new LoginCredential(email, password));
  } catch (error) {
    if (error instanceof EmptyCredentialExcepion)
      return "Complete todos los campos.";
    if (error instanceof InvalidCredentialsException)
      return "Correo o contraseña incorrectos.";
    if (error instanceof AuthException)
      return "Error al iniciar sesión. Intente nuevamente.";

    console.error("Login error:", error);
    return "Ocurrió un error inesperado. Intente nuevamente.";
  }

  redirect("/");
}
