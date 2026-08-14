import { ValidateUserRegistrationUseCase } from "../../../application/usecases/validate-user-registration-use-case";

export const getValidateUserRegistrationUseCase = () =>
  new ValidateUserRegistrationUseCase();
