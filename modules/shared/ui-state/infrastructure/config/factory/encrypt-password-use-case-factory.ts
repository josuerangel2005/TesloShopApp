import { EncryptPasswordUseCase } from "../../../application/usecases/encrypt-password-use-case";
import { BcryptValidatorAdapter } from "../../adapters/out/Encrypt/bcrypt-validator-adapter";

const bcryptValidatorAdapter = new BcryptValidatorAdapter();

export const getEncryptPasswordUseCase = () =>
  new EncryptPasswordUseCase(bcryptValidatorAdapter);
