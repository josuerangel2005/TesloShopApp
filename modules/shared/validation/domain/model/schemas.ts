import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(3, "El nombre debe tener al menos 3 caracteres.")
  .max(80, "El nombre no puede superar los 80 caracteres.")
  .regex(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .-]+$/u,
    "El nombre solo puede contener letras, espacios, puntos y guiones.",
  );

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Ingresa un correo electrónico válido, por ejemplo: nombre@correo.com");

export const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres.")
  .regex(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula.")
  .regex(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula.")
  .regex(/[0-9]/, "La contraseña debe incluir al menos un número.");

export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
