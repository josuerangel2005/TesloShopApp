"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IoCloseOutline,
  IoImageOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

interface Props {
  fieldClass: string;
}

export const RegisterForm = ({ fieldClass }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar con vista previa */}
      <div className="mb-1 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="size-24 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Vista previa de foto de perfil"
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-slate-300">
                <IoPersonCircleOutline size={72} />
              </span>
            )}
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={clearImage}
              aria-label="Quitar foto de perfil"
              className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-slate-700 text-white shadow-sm transition-colors hover:bg-slate-900"
            >
              <IoCloseOutline size={14} />
            </button>
          )}
        </div>

        <label
          htmlFor="signup-avatar"
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <IoImageOutline size={18} />
          {previewUrl ? "Cambiar foto de perfil" : "Subir foto de perfil"}
        </label>

        <input
          ref={fileInputRef}
          id="signup-avatar"
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-name"
          className="text-sm font-medium text-slate-700"
        >
          Nombre Completo
        </label>
        <input
          id="signup-name"
          type="text"
          placeholder="Juan Pérez"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-email"
          className="text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="tu@correo.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-password"
          className="text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          className={fieldClass}
        />
      </div>

      <button className="btn-primary mt-2 w-full justify-center text-center">
        Crear Cuenta
      </button>

      {/* Divisor */}
      <div className="my-2 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-wider text-slate-400">
          O
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Link
        href="/auth/login"
        className="btn-secondary w-full justify-center text-center"
      >
        Iniciar Sesión
      </Link>
    </div>
  );
};
