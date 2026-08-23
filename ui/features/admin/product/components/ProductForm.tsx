"use client";

import { useRef, type ChangeEvent } from "react";
import {
  IoAddOutline,
  IoAlertCircleOutline,
  IoCloudUploadOutline,
  IoCloseOutline,
  IoShirtOutline,
  IoArrowBackOutline,
} from "react-icons/io5";

import { useForm, type FieldPath } from "react-hook-form";
import clsx from "clsx";
import { ProductResponse } from "../../../product";
import { Size } from "../../../../../modules/shared/ui-state/domain/model/size";
import { CategoryResponse } from "../interfaces/category-response";
import { ProductFormResponse } from "../interfaces/product-form-response";
import Image from "next/image";
import { updateProductAction } from "../actions/update-product-action";
import { useRouter } from "next/navigation";
import { saveProductAction } from "../actions/save-product-action";
import Link from "next/link";

interface Props {
  product?: ProductResponse;
  categories: CategoryResponse[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Mapeo explícito: clave del fieldErrors del servidor → ruta del formulario
const serverFieldToFormPath: Record<string, FieldPath<ProductFormResponse>> = {
  title: "title",
  slug: "slug",
  description: "description",
  price: "price",
  tags: "tags",
  gender: "gender",
  sizes: "sizes",
  inStock: "inStock",
  imagesQuantity: "images",
  category: "category.name",
};

const FieldErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="flex items-center gap-1 text-xs font-medium text-red-600"
    >
      <IoAlertCircleOutline className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
};

// Banner destacado para secciones sin input tradicional (tallas, imágenes)
const SectionErrorBanner = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
    >
      <IoAlertCircleOutline className="h-5 w-5 shrink-0" aria-hidden />
      {message}
    </div>
  );
};

// Campos con borde rojo cuando tienen error de validación
const inputClassName = (hasError?: boolean) =>
  clsx(
    "w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400",
    hasError
      ? "border-red-400 bg-red-50/60 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200"
      : "border-slate-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20",
  );

const selectClassName = (hasError?: boolean) =>
  clsx(
    "w-full cursor-pointer appearance-none rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition",
    hasError
      ? "border-red-400 bg-red-50/60 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200"
      : "border-slate-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20",
  );

export const ProductForm = ({ product, categories }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors, defaultValues },
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<ProductFormResponse>({
    defaultValues: {
      id: product?.id ?? "",
      title: product?.title ?? "",
      description: product?.description ?? "",
      inStock: product?.inStock ?? 0,
      price: product?.price ?? 0,
      sizes: product?.sizes ?? [],
      slug: product?.slug ?? "",
      tags: product?.tags ?? [],
      gender: product?.gender ?? "MEN",
      category: product?.category ?? { name: "" },
      images: product?.images.map((img) => img.url) ?? [],
    },
  });

  const selectedImages = watch("images") ?? [];

  const selectedSizes = watch("sizes") ?? [];

  const filesRef = useRef<Map<string, File>>(new Map());

  const router = useRouter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    const currentImages = getValues("images") ?? [];

    const newPreviews = files.map((file) => {
      const url = URL.createObjectURL(file);
      filesRef.current.set(url, file);
      return url;
    });

    setValue("images", [...currentImages, ...newPreviews], {
      shouldValidate: true,
      shouldDirty: true,
    });
    clearErrors("images");

    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = getValues("images") ?? [];
    const urlToRemove = currentImages[index];

    if (urlToRemove.startsWith("blob.")) {
      URL.revokeObjectURL(urlToRemove);
      filesRef.current.delete(urlToRemove);
    }

    setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const handleOnToggleSize = (newSize: string) => {
    const currentSizes = getValues("sizes") ?? [];
    const exists = currentSizes.includes(newSize as Size);

    setValue(
      "sizes",
      exists
        ? currentSizes.filter((s) => s !== newSize)
        : [...currentSizes, newSize as Size],
      { shouldValidate: true, shouldDirty: true },
    );
    clearErrors("sizes");
  };

  const handleOnSubmit = async (data: ProductFormResponse) => {
    const currentFiles = getValues("images") ?? [];
    const filesUrls = [...filesRef.current.keys()];

    if (currentFiles.length < 2) {
      setError("images", {
        type: "minLength",
        message: "Debe subir mínimo 2 imágenes",
      });
      return;
    }

    if (data.sizes.length < 1) {
      setError("sizes", {
        type: "minLength",
        message: "Debe tener mínimo una talla",
      });
      return;
    }

    const result = product
      ? await updateProductAction(
          data,
          [...filesRef.current.values()],
          currentFiles.filter((urlImg) => !filesUrls.includes(urlImg)),
        )
      : await saveProductAction(data, [...filesRef.current.values()]);

    if (result.success === false) {
      if ("fieldErrors" in result && result.fieldErrors) {
        const { fieldErrors } = result;

        Object.entries(fieldErrors).forEach(([serverField, message]) => {
          if (!message) return;

          const formPath = serverFieldToFormPath[serverField];
          if (!formPath) return;

          setError(formPath, { type: "manual", message });
        });
      } else if ("message" in result) {
        setError("slug", {
          type: "manual",
          message: result.message,
        });
      }
      return;
    }

    router.push("/admin/products");
  };

  return (
    <>
      <Link
        href="/admin/products"
        className="mb-5 mt-1 flex w-fit items-center gap-1 font-medium text-slate-600 underline-offset-4 hover:text-primary hover:underline"
      >
        <IoArrowBackOutline size={18} />
        Atrás
      </Link>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="mb-16 grid w-full grid-cols-1 gap-6 px-5 sm:px-0 lg:grid-cols-2"
        noValidate
      >
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6">
          {/* Información general */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              <IoShirtOutline className="h-4 w-4 text-primary" />
              Información general
            </h2>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Título
                </span>
                <input
                  {...register("title", {
                    required: "El título del producto es obligatorio",
                    minLength: {
                      value: 8,
                      message: "Debe tener mínimo 8 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "Debe tener máximo 100 caracteres",
                    },
                    validate: (value) =>
                      !/[@$!%*?&._-]/.test(value) ||
                      "No debe tener caracteres especiales",
                  })}
                  type="text"
                  className={inputClassName(Boolean(errors.title))}
                />
                <FieldErrorMessage message={errors.title?.message} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Slug
                </span>
                <input
                  type="text"
                  className={inputClassName(Boolean(errors.slug))}
                  {...register("slug", {
                    required: "El slug es obligatorio",
                    validate: (value) =>
                      !/\s/.test(value) ||
                      "No debe contener espacios en blanco",
                  })}
                />
                <FieldErrorMessage message={errors.slug?.message} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Descripción
                </span>
                <textarea
                  {...register("description", {
                    required: "La descripción es obligatoria",
                    minLength: {
                      value: 20,
                      message: "Debe tener como mínimo 20 caracteres",
                    },
                    maxLength: {
                      value: 600,
                      message: "Debe tener como máximo 600 caracteres",
                    },
                  })}
                  rows={5}
                  className={clsx(
                    inputClassName(Boolean(errors.description)),
                    "resize-none",
                  )}
                />
                <FieldErrorMessage message={errors.description?.message} />
              </label>
            </div>
          </section>

          {/* Precio y clasificación */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Precio y clasificación
            </h2>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Precio (USD)
                </span>
                <input
                  {...register("price", {
                    required: "Precio obligatorio",
                    min: {
                      value: 25,
                      message: "El precio mínimo son  25 dólares",
                    },
                  })}
                  type="number"
                  className={inputClassName(Boolean(errors.price))}
                />
                <FieldErrorMessage message={errors.price?.message} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Stock
                </span>
                <input
                  {...register("inStock", {
                    required: "Stock obligatorio",
                    min: {
                      value: 0,
                      message: "El stock no puede ser menor a cero",
                    },
                  })}
                  type="number"
                  className={inputClassName(Boolean(errors.inStock))}
                />
                <FieldErrorMessage message={errors.inStock?.message} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Etiquetas
                </span>
                <input
                  type="text"
                  placeholder="shirt, t-shirt, ..."
                  className={inputClassName(Boolean(errors.tags))}
                  {...register("tags", {
                    required: "Debe tener al menos un tag",
                  })}
                />
                <FieldErrorMessage message={errors.tags?.message} />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Género
                  </span>
                  <select
                    {...register("gender", {
                      required: "Género obligatorio",
                    })}
                    className={selectClassName(Boolean(errors.gender))}
                  >
                    <option value="">[Seleccione]</option>
                    <option value="men">Hombre</option>
                    <option value="women">Mujer</option>
                    <option value="kid">Niño</option>
                    <option value="unisex">Unisex</option>
                  </select>
                  <FieldErrorMessage message={errors.gender?.message} />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Categoría
                  </span>
                  <select
                    {...register("category.name", {
                      required: "Categoria obligatoria",
                    })}
                    className={selectClassName(Boolean(errors.category?.name))}
                  >
                    <option value="">[Seleccione]</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FieldErrorMessage message={errors.category?.name?.message} />
                </label>
              </div>
            </div>
          </section>

          <button type="submit" className="btn-primary w-full py-2.5">
            <IoAddOutline className="h-4 w-4" />
            Guardar
          </button>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">
          {/* Tallas */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Tallas
            </h2>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isSelected = selectedSizes.includes(size as Size);
                const hasSizeError = Boolean(errors.sizes);

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleOnToggleSize(size)}
                    className={clsx(
                      "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                      isSelected
                        ? "border-blue-950 bg-blue-950 text-white"
                        : hasSizeError
                          ? "border-red-300 bg-red-50 text-red-400 hover:border-red-400 hover:text-red-500"
                          : "border-slate-300 bg-slate-50 text-slate-600 hover:border-primary hover:bg-primary/5 hover:text-primary",
                    )}
                  >
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>

            <SectionErrorBanner message={errors.sizes?.message} />
          </section>

          {/* Fotos */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              <span>Fotos</span>
              {selectedImages.length > 0 && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                  {selectedImages.length} seleccionada
                  {selectedImages.length !== 1 ? "s" : ""}
                </span>
              )}
            </h2>
            {selectedImages.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {selectedImages.map((preview, index) => (
                  <div
                    key={preview}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                  >
                    <Image
                      src={preview}
                      alt={`Vista previa ${index + 1}`}
                      width={400}
                      height={400}
                      objectFit="cover"
                      loading="lazy"
                      unoptimized={preview.startsWith("blob:")}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="cursor-pointer absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/60 text-white transition-colors hover:bg-red-600"
                      aria-label={`Quitar imagen ${index + 1}`}
                    >
                      <IoCloseOutline className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label
              className={clsx(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                errors.images
                  ? "border-red-300 bg-red-50 hover:border-red-400"
                  : "border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary/5",
              )}
            >
              <IoCloudUploadOutline
                className={clsx(
                  "h-8 w-8",
                  errors.images ? "text-red-400" : "text-slate-400",
                )}
              />
              <span
                className={clsx(
                  "text-sm font-medium",
                  errors.images ? "text-red-600" : "text-slate-600",
                )}
              >
                Subir imágenes del producto
              </span>
              <span
                className={
                  errors.images
                    ? "text-xs text-red-400"
                    : "text-xs text-slate-400"
                }
              >
                PNG o JPG — puede elegir varias
              </span>
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            <SectionErrorBanner message={errors.images?.message} />
          </section>
        </div>
      </form>{" "}
    </>
  );
};
