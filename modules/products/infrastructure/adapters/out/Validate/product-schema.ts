import { z } from "zod";

export const sizesScheme = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);

export const genderSchema = z.enum(["men", "women", "kid", "unisex"]);

export const categorySchema = z
  .string()
  .trim()
  .min(3, "El nombre de la categoría debe tener al menos 3 caracteres.")
  .max(80, "El nombre de la categoría no puede superar los 80 caracteres.")
  .regex(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .-]+$/u,
    "El nombre de la categoría solo puede contener letras, espacios, puntos y guiones.",
  );

export const idScheme = z
  .string()
  .uuid("El ID del producto debe ser un UUID válido.");

export const titleScheme = z
  .string()
  .trim()
  .min(3, "El título del producto debe tener al menos 3 caracteres.")
  .max(80, "El título del producto no puede superar los 80 caracteres.")
  .regex(
    /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü .,-]+$/u,
    "El título del producto solo puede contener letras, números, espacios, puntos y guiones.",
  );

export const descriptionScheme = z
  .string()
  .trim()
  .min(10, "La descripción del producto debe tener al menos 10 caracteres.")
  .max(500, "La descripción del producto no puede superar los 500 caracteres.")
  .regex(
    /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü\s.,;:¡!¿?'"()%&#@/-]+$/u,
    "La descripción del producto contiene caracteres no permitidos.",
  );

export const inStockScheme = z
  .number()
  .int()
  .nonnegative("El stock del producto debe ser un número entero no negativo.");

export const priceScheme = z
  .number()
  .nonnegative("El precio del producto debe ser un número no negativo.");

export const sizesArrayScheme = z
  .array(sizesScheme)
  .nonempty("El producto debe tener al menos un tamaño.");

export const slugScheme = z
  .string()
  .trim()
  .min(1, "El slug del producto no puede estar vacío.")
  .max(100, "El slug del producto no puede superar los 100 caracteres.")
  .regex(
    /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
    "El slug del producto solo puede contener letras minúsculas, números y guiones bajos.",
  );

export const tagsScheme = z
  .array(z.string().trim())
  .nonempty("El producto debe tener al menos una etiqueta.")
  .max(10, "El producto no puede tener más de 10 etiquetas.")
  .min(1, "Cada etiqueta debe tener al menos 1 carácter.");

export const imagesQuantityScheme = z
  .number()
  .int()
  .nonnegative("La cantidad de imágenes debe ser un número entero no negativo.")
  .min(1, "El producto debe tener al menos una imagen.")
  .max(5, "El producto no puede tener más de 5 imágenes.");

export const ProductSchema = z.object({
  id: idScheme,
  title: titleScheme,
  description: descriptionScheme,
  inStock: inStockScheme,
  price: priceScheme,
  sizes: sizesArrayScheme,
  slug: slugScheme,
  tags: tagsScheme,
  gender: genderSchema,
  category: categorySchema,
  imagesQuantity: imagesQuantityScheme,
});
