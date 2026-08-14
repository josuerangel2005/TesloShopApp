import { ShowMessageUseCase } from "../../../application/usecases/show-message-use-case";
import { ToastShowMessageAdapter } from "../../adapters/out/ToastShowMessage/toast-show-message-adapter";

const toastShowMessageAdapter = new ToastShowMessageAdapter();

export const getShowMessageUseCase = () =>
  new ShowMessageUseCase(toastShowMessageAdapter);