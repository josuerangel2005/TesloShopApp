"use server";

import { VerificationTokenExpiredException } from "../../../../modules/auth/domain/error/verification-token-expired-exception";
import { VerificationTokenInvalidException } from "../../../../modules/auth/domain/error/verification-token-invalid-exception";
import { getHandleAuthUseCase } from "../../../../modules/auth/infrastructure/config/factory/handle-auth-use-case-factory";

export async function verifyEmail(
  prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  const token = formData.get("token")?.toString().trim() ?? "";

  try {
    if (!token) return "No se encontró el enlace de verificación";
    await getHandleAuthUseCase().verifyEmail(token);
  } catch (error) {
    if (error instanceof VerificationTokenInvalidException)
      return "El enlace es inválido o ya fue utilizado.";
    if (error instanceof VerificationTokenExpiredException)
      return "El enlace expiró. Solicitá un nuevo correo de verificación.";

    console.error("Verify email error:", error);
    return "Ocurrió un error al verificar tu correo. Intentalo de nuevo.";
  }

  return "Tu correo fue verificado correctamente.";
}
