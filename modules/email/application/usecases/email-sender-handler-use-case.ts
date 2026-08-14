import { EmailMessage } from "../../domain/model/email-message";
import { ForEmailSender } from "../../domain/ports/driven/for-email-sender";

export class EmailSenderHandlerUseCase {
  private readonly forEmailSender: ForEmailSender;

  constructor(forEmailSender: ForEmailSender) {
    this.forEmailSender = forEmailSender;
  }

  public send(message: EmailMessage): Promise<void> {
    return this.forEmailSender.send(message);
  }
}
