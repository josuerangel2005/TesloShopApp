"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { authenticate } from "../../actions/login-action";

interface Props {
  fieldClass: string;
}

export const LoginForm = ({ fieldClass }: Props) => {
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="flex flex-col gap-4">
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
      </div>

      <button
        type="submit"
        className="btn-primary mt-2 w-full justify-center text-center"
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
