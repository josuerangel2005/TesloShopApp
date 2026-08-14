import { titleFont } from "@/config/fonts";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoFingerPrintOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { logout } from "../../login/actions/logout-action";

interface ProfileInfoProps {
  profile: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    image: string;
    emailVerified: Date | null;
  };
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const { id, name, email, role, image, emailVerified } = profile;
  const isAdmin = role === "ADMIN";
  const isVerified = emailVerified !== null;

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "?";

  const statusRing = isVerified ? "ring-emerald-200" : "ring-amber-200";

  return (
    <div className="fade-in grid items-start gap-6 lg:grid-cols-3">
      {/* Tarjeta de identidad */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {image ? (
              <img
                src={image}
                alt={name}
                className={`h-28 w-28 rounded-full object-cover ring-4 ${statusRing}`}
              />
            ) : (
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full bg-primary text-3xl font-semibold text-white ring-4 ${statusRing}`}
              >
                {initials}
              </div>
            )}
            <span
              className={`absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${
                isVerified ? "bg-emerald-500" : "bg-amber-500"
              }`}
              title={isVerified ? "Correo verificado" : "Correo sin verificar"}
            >
              {isVerified ? (
                <IoCheckmarkCircleOutline className="h-4 w-4 text-white" />
              ) : (
                <IoAlertCircleOutline className="h-4 w-4 text-white" />
              )}
            </span>
          </div>

          <h2
            className={`${titleFont.className} mt-4 text-2xl font-semibold text-slate-800`}
          >
            {name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{email}</p>

          <span
            className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              isAdmin
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-slate-600"
            }`}
          >
            {isAdmin ? "Administrador" : "Usuario"}
          </span>

          <form action={logout} className="mt-6 w-full">
            <button
              type="submit"
              className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <IoLogOutOutline className="h-4 w-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </section>

      {/* Detalles de la cuenta */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Detalles de la cuenta
        </h3>
        <p className="mb-5 text-sm text-slate-400">
          Información asociada a tu perfil
        </p>

        <dl className="divide-y divide-gray-100">
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="flex items-center gap-3 text-sm text-slate-600">
              <IoMailOutline className="h-5 w-5 shrink-0 text-slate-400" />
              Correo electrónico
            </dt>
            <dd className="flex flex-wrap items-center justify-end gap-2 text-right">
              <span className="text-sm font-medium text-slate-900">
                {email}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isVerified
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {isVerified ? "Verificado" : "Sin verificar"}
              </span>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="flex items-center gap-3 text-sm text-slate-600">
              <IoShieldCheckmarkOutline className="h-5 w-5 shrink-0 text-slate-400" />
              Rol
            </dt>
            <dd className="text-sm font-medium text-slate-900">
              {isAdmin ? "Administrador" : "Usuario"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="flex items-center gap-3 text-sm text-slate-600">
              <IoFingerPrintOutline className="h-5 w-5 shrink-0 text-slate-400" />
              ID de usuario
            </dt>
            <dd
              className="max-w-[60%] truncate text-right font-mono text-xs text-slate-400"
              title={id}
            >
              {id}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
