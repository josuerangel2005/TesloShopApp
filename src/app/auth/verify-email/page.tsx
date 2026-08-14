import type { Metadata } from "next";
import { titleFont } from "@/config/fonts";
import { VerifyEmailForm } from "../../../../ui/features/verify-email/components/Verify-email-form/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verificar email",
  description: "Confirma tu correo electrónico para activar tu cuenta.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <div className="mb-8 text-center">
          <p
            className={`${titleFont.className} text-3xl font-bold text-slate-800`}
          >
            Teslo
            <span className="text-primary"> | Shop</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Verificación de cuenta</p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-lg font-semibold text-slate-800">
          Enlace inválido
        </h1>

        <p className="text-sm leading-relaxed text-slate-500">
          No se encontró un enlace de verificación. Revisá el correo que
          recibiste o solicitá uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mb-8 text-center">
        <p
          className={`${titleFont.className} text-3xl font-bold text-slate-800`}
        >
          Teslo
          <span className="text-primary"> | Shop</span>
        </p>
        <p className="mt-1 text-sm text-slate-500">Verificación de cuenta</p>
      </div>

      <VerifyEmailForm token={token} />
    </div>
  );
}
