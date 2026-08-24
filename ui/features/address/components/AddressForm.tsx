"use client";

import { CountryActionResponse } from "../interface/country-action-response";
import { getHandleAddressStateUseCase } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-address-state-use-case-factory";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getAddressByUserIdAction } from "../actions/get-address-by-user-id-action";
import { addressResponseToAddress } from "../mapper/address.mapper";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { userAddressSchema } from "../../../../modules/shared/validation";
import { Address } from "../../../../modules/shared/ui-state/domain/model/address";
import { saveUserAddressAction } from "../actions/save-user-address-action";
import { deleteUserAddressAction } from "../actions/delete-user-address-action";

const baseFieldClass =
  "rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2";

const getFieldClass = (hasError: boolean) =>
  `${baseFieldClass} ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-primary focus:ring-primary/20"
  }`;

const FieldErrorMessage = ({
  id,
  message,
}: {
  id: string;
  message?: string;
}) =>
  message ? (
    <p
      id={id}
      className="flex items-center gap-1 text-xs font-medium text-red-500"
      role="alert"
    >
      <span aria-hidden="true">⚠</span>
      <span>{message}</span>
    </p>
  ) : null;

interface Props {
  countries: CountryActionResponse[];
}

interface FormFields {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  remember: boolean;
}

const handleAddressStateUseCase = getHandleAddressStateUseCase();

export const AddressForm = ({ countries }: Props) => {
  const address = useSyncExternalStore(
    (listener) => handleAddressStateUseCase.subscribe(listener),
    () => handleAddressStateUseCase.getAddress(),
    () => null,
  );

  const [ready, setReady] = useState(false);

  const router = useRouter();

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    clearErrors,
    getValues,
  } = useForm<FormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      address2: "",
      postalCode: "",
      city: "",
      country: "",
      phone: "",
      remember: true,
    },
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const userAddress = await getAddressByUserIdAction();

        if (userAddress) {
          handleAddressStateUseCase.saveAddress(
            addressResponseToAddress(userAddress),
          );
        } else {
          handleAddressStateUseCase.deleteAddress();
        }
      } catch {
      } finally {
        setReady(true);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    reset({
      firstName: address?.getFirstName() ?? "",
      lastName: address?.getLastName() ?? "",
      address: address?.getAddress() ?? "",
      address2: address?.getAddress2() ?? "",
      postalCode: address?.getPostalCode() ?? "",
      city: address?.getCity() ?? "",
      country: address?.getCountry() ?? "",
      phone: address?.getPhone() ?? "",
      remember: getValues("remember"),
    });
  }, [address, reset, getValues]);

  const handleOnSubmit = async (data: FormFields) => {
    const parsed = userAddressSchema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      address2: data.address2,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      phone: data.phone,
    });

    if (!parsed.success) {
      clearErrors();

      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FormFields;

        setError(fieldName, {
          type: "manual",
          message: issue.message,
        });
      });

      return;
    }

    clearErrors();

    handleAddressStateUseCase.saveAddress(
      new Address(
        data.firstName,
        data.lastName,
        data.address,
        data.address2,
        data.postalCode,
        data.city,
        data.country,
        data.phone,
      ),
    );

    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("address", data.address);
    formData.append("address2", data.address2);
    formData.append("postalCode", data.postalCode);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("phone", data.phone);

    if (data.remember) {
      await saveUserAddressAction(formData);
    } else {
      await deleteUserAddressAction();
    }

    router.push("/checkout");
  };

  if (!ready) {
    return (
      <div className="address-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="py-8 text-center text-sm text-slate-500">
          Cargando dirección…
        </p>
      </div>
    );
  }

  return (
    <div className="address-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        noValidate
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
      >
        {/* First name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-slate-700"
          >
            Nombres
          </label>

          <input
            id="firstName"
            {...register("firstName", {
              required: "Campo Obligatorio",
            })}
            type="text"
            placeholder="Juan"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={getFieldClass(!!errors.firstName)}
          />

          <FieldErrorMessage
            id="firstName-error"
            message={errors.firstName?.message}
          />
        </div>

        {/* Last name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-slate-700"
          >
            Apellidos
          </label>

          <input
            id="lastName"
            {...register("lastName", {
              required: "Campo Obligatorio",
            })}
            type="text"
            placeholder="Pérez"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className={getFieldClass(!!errors.lastName)}
          />

          <FieldErrorMessage
            id="lastName-error"
            message={errors.lastName?.message}
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="address"
            className="text-sm font-medium text-slate-700"
          >
            Dirección
          </label>

          <input
            id="address"
            {...register("address", {
              required: "Campo Obligatorio",
            })}
            type="text"
            placeholder="Av. Principal 123"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            className={getFieldClass(!!errors.address)}
          />

          <FieldErrorMessage
            id="address-error"
            message={errors.address?.message}
          />
        </div>

        {/* Address 2 */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="address2"
            className="text-sm font-medium text-slate-700"
          >
            Dirección 2{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>

          <input
            id="address2"
            {...register("address2")}
            type="text"
            placeholder="Depto, oficina, piso"
            aria-invalid={!!errors.address2}
            aria-describedby={errors.address2 ? "address2-error" : undefined}
            className={getFieldClass(!!errors.address2)}
          />

          <FieldErrorMessage
            id="address2-error"
            message={errors.address2?.message}
          />
        </div>

        {/* Postal code */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="postalCode"
            className="text-sm font-medium text-slate-700"
          >
            Código postal
          </label>

          <input
            id="postalCode"
            {...register("postalCode", {
              required: "Campo Obligatorio",
            })}
            type="text"
            placeholder="10101"
            aria-invalid={!!errors.postalCode}
            aria-describedby={
              errors.postalCode ? "postalCode-error" : undefined
            }
            className={getFieldClass(!!errors.postalCode)}
          />

          <FieldErrorMessage
            id="postalCode-error"
            message={errors.postalCode?.message}
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-medium text-slate-700">
            Ciudad
          </label>

          <input
            id="city"
            {...register("city", {
              required: "Campo Obligatorio",
            })}
            type="text"
            placeholder="San José"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
            className={getFieldClass(!!errors.city)}
          />

          <FieldErrorMessage id="city-error" message={errors.city?.message} />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="country"
            className="text-sm font-medium text-slate-700"
          >
            País
          </label>

          <select
            id="country"
            {...register("country", {
              required: "Campo Obligatorio",
            })}
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "country-error" : undefined}
            className={getFieldClass(!!errors.country)}
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

          <FieldErrorMessage
            id="country-error"
            message={errors.country?.message}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Teléfono
          </label>

          <input
            id="phone"
            {...register("phone", {
              required: "Campo Obligatorio",
            })}
            type="tel"
            placeholder="+506 8888 8888"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={getFieldClass(!!errors.phone)}
          />

          <FieldErrorMessage id="phone-error" message={errors.phone?.message} />
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-5 sm:col-span-2">
          <label
            htmlFor="remember-address"
            className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-700"
          >
            <input
              id="remember-address"
              {...register("remember")}
              type="checkbox"
              className="size-4 cursor-pointer accent-primary"
            />

            <span>Recordar dirección para futuras compras</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center text-center transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
          >
            {isSubmitting ? "Guardando…" : "Siguiente"}
          </button>
        </div>
      </form>
    </div>
  );
};
