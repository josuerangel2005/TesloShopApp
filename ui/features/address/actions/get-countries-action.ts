import { getHandleCountriesUseCase } from "../../../../modules/geography/infrastructure/config/factory/handle-countries-use-case-factory";
import { CountryActionResponse } from "../interface/country-action-response";

export const getAllCountriesAction = async (): Promise<
  CountryActionResponse[]
> => {
  try {
    const handleCountriesUseCase = getHandleCountriesUseCase();

    return (await handleCountriesUseCase.getAllCountries()).map((country) => ({
      name: country.getName(),
      id: country.getCountryId(),
    }));
  } catch (error) {
    throw error;
  }
};
