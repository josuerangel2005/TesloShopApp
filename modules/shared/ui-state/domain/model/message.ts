export class Message {
  private type: string;
  private message: string;

  constructor(type: string, message: string) {
    this.type = type;
    this.message = message;
  }

  public getType(): string {
    return this.type;
  }

  public getMessage(): string {
    return this.message;
  }
}
