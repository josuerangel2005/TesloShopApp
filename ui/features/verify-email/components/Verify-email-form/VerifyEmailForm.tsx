"use client";

import { useActionState } from "react";
import { verifyEmail } from "../../actions/verify-email-action";

export function VerifyEmailForm({ token }: { token: string }) {
  const [state, dispatch] = useActionState(verifyEmail, undefined);

  const isSuccess = state === "Tu correo fue verificado correctamente.";

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border ${
          isSuccess
            ? "border-green-200 bg-green-50 text-green-600"
            : "border-primary/20 bg-primary/5 text-primary"
        }`}
      >
        {isSuccess ? (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
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
        )}
      </div>

      <form action={dispatch} className="flex w-full flex-col gap-4">
        <input type="hidden" name="token" value={token} />

        <button
          type="submit"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Verificar email
        </button>
      </form>

      <h1 className="text-lg font-semibold text-slate-800">
        {isSuccess ? "¡Email verificado!" : "Confirmá tu correo"}
      </h1>

      <p className="text-sm leading-relaxed text-slate-500">
        {state ??
          "Hacé click en el botón para confirmar tu dirección de correo electrónico."}
      </p>
    </div>
  );
}