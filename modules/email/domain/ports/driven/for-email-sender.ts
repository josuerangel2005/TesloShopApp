import { EmailMessage } from "../../model/email-message";

export interface ForEmailSender {
  send: (message: EmailMessage) => Promise<void>;
}
