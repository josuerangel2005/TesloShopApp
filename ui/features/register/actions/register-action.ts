"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { UserAlreadyExistsException } from "../../../../modules/auth/domain/error/user-already-exists-exception";
import { UserSaveCommand } from "../../../../modules/auth/domain/model/commands/user-save-command";
import { Role } from "../../../../modules/auth/domain/model/role";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getEmailSenderHandlerUseCase, verificationEmail } from "../../../../modules/email";
import { ImageUpload } from "../../../../modules/shared/ui-state/domain/model/image-upload";
import { getHandleUploadImageUseCase } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-upload-image-use-case-factory";

export async function register(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  const name: string = formData.get("name")?.toString().trim() ?? "";
  const email: string = formData.get("email")?.toString().trim() ?? "";
  const password: string = formData.get("password")?.toString().trim() ?? "";
  const imageFile = formData.get("image") as File | null;

  try {
    // 1. Imagen opcional
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const image = new ImageUpload(
        Buffer.from(await imageFile.arrayBuffer()),
        imageFile.type,
        imageFile.name,
      );
      imageUrl = await getHandleUploadImageUseCase().upload(image);
    }

    // 2. Registrar el usuario
    await getHandleAuthUseCase().register(
      new UserSaveCommand(name, email, password, Role.user, imageUrl ?? ""),
    );

    // 3. Generar token de verificación
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await getHandleAuthUseCase().saveEmailVerification(email, token, expiresAt);

    // 4. Enviar el correo de verificación
    const link = `${process.env.NEXTAUTH_URL ?? ""}/auth/verify-email?token=${token}`;
    await getEmailSenderHandlerUseCase().send(verificationEmail(email, link));

    // 5. Redirigir
    redirect("/auth/check-email");
  } catch (error) {
    if (error instanceof UserAlreadyExistsException)
      return "Ya existe una cuenta con ese correo.";

    console.error("Register error:", error);
    return "Ocurrió un error al registrar la cuenta.";
  }
}
