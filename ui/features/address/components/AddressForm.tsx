"use client";
import { CountryActionResponse } from "../interface/country-action-response";
import { saveUserAddressAction } from "../actions/save-user-address-action";
import { deleteUserAddressAction } from "../actions/delete-user-address-action";
import { useRouter } from "next/navigation";
import { getHandleAddressStateUseCase } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-address-state-use-case-factory";
import { Address } from "../../../../modules/shared/ui-state/domain/model/address";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getAddressByUserIdAction } from "../actions/get-address-by-user-id-action";
import { addressResponseToAddress } from "../mapper/address.mapper";
import { userAddressSchema } from "../../../../modules/shared/validation/domain/model/schemas";

const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const FieldErrorMessage = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-xs font-medium text-red-500" role="alert">
      {message}
    </p>
  ) : null;

interface Props {
  countries: CountryActionResponse[];
}

export const AddressForm = ({ countries }: Props) => {
  const handleAddressStateUseCase = getHandleAddressStateUseCase();

  const address = useSyncExternalStore(
    (listener) => handleAddressStateUseCase.subscribe(listener),
    () => handleAddressStateUseCase.getAddress(),
    () => null,
  );

  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAddress = async () => {
      if (address) {
        setReady(true);
        return;
      }

      try {
        const userAddress = await getAddressByUserIdAction();
        if (userAddress) {
          handleAddressStateUseCase.saveAddress(
            addressResponseToAddress(userAddress),
          );
        }
      } catch {
      } finally {
        setReady(true);
      }
    };

    fetchAddress();
  }, [address, handleAddressStateUseCase]);

  const handleSubmitForm = async (formData: FormData) => {
    const fields = {
      firstName: formData.get("firstName")?.toString() ?? "",
      lastName: formData.get("lastName")?.toString() ?? "",
      address: formData.get("address")?.toString() ?? "",
      address2: formData.get("address2")?.toString() ?? "",
      postalCode: formData.get("postalCode")?.toString() ?? "",
      city: formData.get("city")?.toString() ?? "",
      country: formData.get("country")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      remember: formData.get("remember") === "on",
    };

    // Validación estricta client-side: campos vacíos/inválidos bloquean el avance
    const parsed = userAddressSchema.safeParse({
      firstName: fields.firstName,
      lastName: fields.lastName,
      address: fields.address,
      address2: fields.address2,
      postalCode: fields.postalCode,
      city: fields.city,
      country: fields.country,
      phone: fields.phone,
    });

    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(
            ([field, messages]) => [field, messages?.[0] ?? "Campo inválido"],
          ),
        ),
      );
      return;
    }

    setFieldErrors({});

    handleAddressStateUseCase.saveAddress(
      new Address(
        fields.firstName,
        fields.lastName,
        fields.address,
        fields.address2,
        fields.postalCode,
        fields.city,
        fields.country,
        fields.phone,
      ),
    );

    const remember = formData.get("remember") === "on";

    if (remember) await saveUserAddressAction(formData);
    else await deleteUserAddressAction();

    router.push("/checkout");
  };

  return (
    <div className="address-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      {!ready ? (
        <p className="py-8 text-center text-sm text-slate-500">
          Cargando dirección…
        </p>
      ) : (
        <form
          action={handleSubmitForm}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
        >
          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-slate-700"
            >
              Nombres
            </label>
            <input
              defaultValue={address?.getFirstName()}
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Juan"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.firstName} />
          </div>

          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-slate-700"
            >
              Apellidos
            </label>
            <input
              id="lastName"
              defaultValue={address?.getLastName()}
              type="text"
              name="lastName"
              placeholder="Pérez"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.lastName} />
          </div>

          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="address"
              className="text-sm font-medium text-slate-700"
            >
              Dirección
            </label>
            <input
              id="address"
              defaultValue={address?.getAddress()}
              type="text"
              name="address"
              placeholder="Av. Principal 123"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.address} />
          </div>

          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="address2"
              className="text-sm font-medium text-slate-700"
            >
              Dirección 2 (opcional)
            </label>
            <input
              id="address2"
              type="text"
              defaultValue={address?.getAddress2() ?? ""}
              name="address2"
              placeholder="Depto, oficina, piso"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.address2} />
          </div>

          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="postalCode"
              className="text-sm font-medium text-slate-700"
            >
              Código postal
            </label>
            <input
              id="postalCode"
              name="postalCode"
              defaultValue={address?.getPostalCode()}
              type="text"
              placeholder="10101"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.postalCode} />
          </div>

          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="city"
              className="text-sm font-medium text-slate-700"
            >
              Ciudad
            </label>
            <input
              id="city"
              type="text"
              defaultValue={address?.getCity()}
              name="city"
              placeholder="San José"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.city} />
          </div>

          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="country"
              className="text-sm font-medium text-slate-700"
            >
              País
            </label>
            <select
              id="country"
              name="country"
              defaultValue={address?.getCountry()}
              className={fieldClass}
            >
              <option value="" disabled>
                Selecciona un país
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            <FieldErrorMessage message={fieldErrors.country} />
          </div>
          <div className="address-field flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-700"
            >
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={address?.getPhone()}
              type="text"
              placeholder="+506 8888 8888"
              className={fieldClass}
            />
            <FieldErrorMessage message={fieldErrors.phone} />
          </div>

          <div className="address-field address-submit flex flex-col gap-5 sm:col-span-2">
            <label
              htmlFor="remember-address"
              className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-700"
            >
              <input
                id="remember-address"
                name="remember"
                type="checkbox"
                defaultChecked
                className="size-4 cursor-pointer accent-primary"
              />
              Recordar dirección para futuras compras
            </label>

            <button
              type="submit"
              className="btn-primary w-full justify-center text-center sm:w-1/2"
            >
              Siguiente
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
