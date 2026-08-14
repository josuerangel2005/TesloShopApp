"use client";

import Link from "next/link";
import { useEffect, useRef, useActionState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { authenticate } from "../../actions/login-action";
import { getShowMessageUseCase } from "../../../../../modules/shared/ui-state";

interface Props {
  fieldClass: string;
  registered?: boolean;
}

export const LoginForm = ({ fieldClass, registered }: Props) => {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const showedRegisteredToast = useRef(false);

  useEffect(() => {
    if (registered && !showedRegisteredToast.current) {
      showedRegisteredToast.current = true;
      getShowMessageUseCase().show(
        "Tu cuenta fue creada. Revisá tu correo para activarla.",
        "success",
      );
    }
  }, [registered]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-email"
          className="text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="tu@correo.com"
          className={fieldClass}
        />
        {state?.fieldsErrors?.email && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-red-600">
            <IoAlertCircleOutline size={16} className="shrink-0" />
            {state.fieldsErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          className={fieldClass}
        />
        {state?.fieldsErrors?.password && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-red-600">
            <IoAlertCircleOutline size={16} className="shrink-0" />
            {state.fieldsErrors.password}
          </p>
        )}
      </div>

      {state?.message && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <IoAlertCircleOutline size={18} className="mt-0.5 shrink-0" />
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        className="btn-primary mt-2 w-full justify-center text-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
      >
        Ingresar
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
        href="/auth/new-account"
        className="btn-secondary w-full justify-center text-center"
      >
        Crear una nueva cuenta
      </Link>
    </form>
  );
};
