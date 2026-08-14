export class EmailMessage {
  private to: string;
  private subject: string;
  private html: string;

  constructor(to: string, subject: string, html: string) {
    this.to = to;
    this.subject = subject;
    this.html = html;
  }

  public getTo(): string {
    return this.to;
  }

  public getSubject(): string {
    return this.subject;
  }

  public getHtml(): string {
    return this.html;
  }
}
