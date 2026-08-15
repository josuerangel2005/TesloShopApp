import Link from "next/link";
import { getAllCountriesAction } from "../actions/get-countries-action";

const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export const AddressForm = async () => {
  const countries = await getAllCountriesAction();
  return (
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
          <label htmlFor="cp" className="text-sm font-medium text-slate-700">
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
          <label htmlFor="pais" className="text-sm font-medium text-slate-700">
            País
          </label>
          <select id="pais" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Selecciona un país
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
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

        <div className="address-field address-submit flex flex-col gap-5 sm:col-span-2">
          <label
            htmlFor="remember-address"
            className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-700"
          >
            <input
              id="remember-address"
              type="checkbox"
              defaultChecked
              className="size-4 cursor-pointer accent-primary"
            />
            Recordar dirección para futuras compras
          </label>

          <Link
            href="/checkout"
            className="btn-primary w-full justify-center text-center sm:w-1/2"
          >
            Siguiente
          </Link>
        </div>
      </div>
    </div>
  );
};
