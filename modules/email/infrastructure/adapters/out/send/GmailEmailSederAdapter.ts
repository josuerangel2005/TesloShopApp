import nodemailer from "nodemailer";
import { ForEmailSender } from "../../../../domain/ports/driven/for-email-sender";
import { EmailMessage } from "../../../../domain/model/email-message";

export class GmailEmailSenderAppAdapter implements ForEmailSender {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  public async send(message: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: `"Teslo Shop" <${process.env.GMAIL_USER}>`,
      to: message.getTo(),
      subject: message.getSubject(),
      html: message.getHtml(),
    });
  }
}
