import { SaveCountryCommand } from "../../domain/model/commands/save-country-command";
import { Country } from "../../domain/model/country";
import { ForHandleCountries } from "../../domain/ports/driven/for-handle-countries";

export class HandleCountriesUseCase {
  private readonly forHandleCountries: ForHandleCountries;

  constructor(forHandleCountries: ForHandleCountries) {
    this.forHandleCountries = forHandleCountries;
  }

  public saveAllCountries(countries: SaveCountryCommand[]): Promise<void> {
    return this.forHandleCountries.saveAllCountries(countries);
  }

  public getAllCountries(): Promise<Country[]> {
    return this.forHandleCountries.getAllCountries();
  }

  public deleteAllCountries(): Promise<void> {
    return this.forHandleCountries.deleteAllCountries();
  }
}
