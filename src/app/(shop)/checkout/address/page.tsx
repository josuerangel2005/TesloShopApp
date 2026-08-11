import type { Metadata } from "next";
import Link from "next/link";
import { Title } from "../../../../../ui";

export const metadata: Metadata = {
  title: "Dirección de entrega",
  description: "Ingresa la dirección de entrega de tu orden de compra.",
};

const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function () {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-0">
      <div className="flex w-full flex-col text-left xl:w-[1000px]">
        <Title title="Dirección" subTitle="Dirección de entrega" />

        <div className="address-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="nombre"
                className="text-sm font-medium text-slate-700"
              >
                Nombres
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Juan"
                className={fieldClass}
              />
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="apellidos"
                className="text-sm font-medium text-slate-700"
              >
                Apellidos
              </label>
              <input
                id="apellidos"
                type="text"
                placeholder="Pérez"
                className={fieldClass}
              />
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="direccion"
                className="text-sm font-medium text-slate-700"
              >
                Dirección
              </label>
              <input
                id="direccion"
                type="text"
                placeholder="Av. Principal 123"
                className={fieldClass}
              />
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="direccion2"
                className="text-sm font-medium text-slate-700"
              >
                Dirección 2 (opcional)
              </label>
              <input
                id="direccion2"
                type="text"
                placeholder="Depto, oficina, piso"
                className={fieldClass}
              />
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="cp"
                className="text-sm font-medium text-slate-700"
              >
                Código postal
              </label>
              <input
                id="cp"
                type="text"
                placeholder="10101"
                className={fieldClass}
              />
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="ciudad"
                className="text-sm font-medium text-slate-700"
              >
                Ciudad
              </label>
              <input
                id="ciudad"
                type="text"
                placeholder="San José"
                className={fieldClass}
              />
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="pais"
                className="text-sm font-medium text-slate-700"
              >
                País
              </label>
              <select id="pais" className={fieldClass}>
                <option value="">[ Seleccione ]</option>
                <option value="CRI">Costa Rica</option>
              </select>
            </div>

            <div className="address-field flex flex-col gap-1.5">
              <label
                htmlFor="telefono"
                className="text-sm font-medium text-slate-700"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                type="text"
                placeholder="+506 8888 8888"
                className={fieldClass}
              />
            </div>

            <div className="address-field address-submit flex flex-col gap-1.5 sm:col-span-2">
              <Link
                href="/checkout"
                className="btn-primary w-full justify-center text-center sm:w-1/2"
              >
                Siguiente
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          .address-card {
            animation: addressFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .address-field {
            opacity: 0;
            animation: addressFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .address-field:nth-child(1) { animation-delay: 0.05s; }
          .address-field:nth-child(2) { animation-delay: 0.10s; }
          .address-field:nth-child(3) { animation-delay: 0.15s; }
          .address-field:nth-child(4) { animation-delay: 0.20s; }
          .address-field:nth-child(5) { animation-delay: 0.25s; }
          .address-field:nth-child(6) { animation-delay: 0.30s; }
          .address-field:nth-child(7) { animation-delay: 0.35s; }
          .address-field:nth-child(8) { animation-delay: 0.40s; }
          .address-submit { animation-delay: 0.48s; }

          @keyframes addressFadeUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .address-card,
            .address-field {
              opacity: 1;
              animation: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
