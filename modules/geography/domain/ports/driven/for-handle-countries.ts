import { SaveCountryCommand } from "../../model/commands/save-country-command";
import { Country } from "../../model/country";

export interface ForHandleCountries {
  saveAllCountries: (countries: SaveCountryCommand[]) => Promise<void>;
  getAllCountries: () => Promise<Country[]>;
  deleteAllCountries: () => Promise<void>;
}
