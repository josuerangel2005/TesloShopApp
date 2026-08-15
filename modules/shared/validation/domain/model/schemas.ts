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

export const firstNameSchema = z
  .string()
  .trim()
  .min(3, "El nombre debe tener al menos 3 caracteres.")
  .max(80, "El nombre no puede superar los 80 caracteres.")
  .regex(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .-]+$/u,
    "El nombre solo puede contener letras, espacios, puntos y guiones.",
  );

export const lastNameSchema = z
  .string()
  .trim()
  .min(3, "El apellido debe tener al menos 3 caracteres.")
  .max(80, "El apellido no puede superar los 80 caracteres.")
  .regex(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .-]+$/u,
    "El apellido solo puede contener letras, espacios, puntos y guiones.",
  );

export const addressSchema = z
  .string()
  .trim()
  .min(5, "La dirección debe tener al menos 5 caracteres.")
  .max(120, "La dirección no puede superar los 120 caracteres.")
  .regex(
    /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñüÜ\s.,#-]+$/u,
    "La dirección solo puede contener letras, números, espacios y los caracteres . , # -",
  );

export const address2Schema = z
  .string()
  .trim()
  .max(80, "El apartamento u oficina no puede superar los 80 caracteres.");

export const postalCodeSchema = z
  .string()
  .trim()
  .min(2, "El código postal debe tener al menos 2 caracteres.")
  .max(12, "El código postal no puede superar los 12 caracteres.")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "El código postal solo puede contener letras, números y guiones.",
  );

export const citySchema = z
  .string()
  .trim()
  .min(2, "La ciudad debe tener al menos 2 caracteres.")
  .max(80, "La ciudad no puede superar los 80 caracteres.")
  .regex(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .-]+$/u,
    "La ciudad solo puede contener letras, espacios, puntos y guiones.",
  );

export const phoneSchema = z
  .string()
  .trim()
  .min(7, "El teléfono debe tener al menos 7 caracteres.")
  .max(20, "El teléfono no puede superar los 20 caracteres.")
  .regex(
    /^\+?[0-9\s().-]+$/,
    "El teléfono solo puede contener números, espacios y los caracteres + ( ) . -",
  );

export const countryIdSchema = z
  .string()
  .trim()
  .min(1, "El país es obligatorio.")
  .max(50, "El identificador del país no puede superar los 50 caracteres.");

export const userAddressSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  address: addressSchema,
  address2: address2Schema,
  postalCode: postalCodeSchema,
  city: citySchema,
  country: countryIdSchema,
  phone: phoneSchema,
});
