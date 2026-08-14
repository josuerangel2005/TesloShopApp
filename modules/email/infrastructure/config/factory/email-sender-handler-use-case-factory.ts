import { EmailSenderHandlerUseCase } from "../../../application/usecases/email-sender-handler-use-case";
import { GmailEmailSenderAppAdapter } from "../../adapters/out/send/GmailEmailSederAdapter";

const gmailEmailSenderAppAdapter = new GmailEmailSenderAppAdapter();

export const getEmailSenderHandlerUseCase = () =>
  new EmailSenderHandlerUseCase(gmailEmailSenderAppAdapter);
