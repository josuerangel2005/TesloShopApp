"use server";

import { getHandleCountriesUseCase } from "../../../../modules/geography/infrastructure/config/factory/handle-countries-use-case-factory";

interface CountryResponse {
  name: string;
}

export const getCountryByCodeAction = async (
  countryId: string,
): Promise<CountryResponse | null> => {
  try {
    const handleCountries = getHandleCountriesUseCase();

    const country = await handleCountries.getCountryByCode(countryId);

    return country ? { name: country.getName() } : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};