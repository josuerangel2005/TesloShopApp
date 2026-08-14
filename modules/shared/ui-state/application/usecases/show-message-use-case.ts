import { Message } from "../../domain/model/message";
import { ForShowMessage } from "../../domain/ports/for-show-message";

export class ShowMessageUseCase {
  private forShowMessage: ForShowMessage;

  constructor(forShowMessage: ForShowMessage) {
    this.forShowMessage = forShowMessage;
  }

  public show(message: string, type: string): void {
    this.forShowMessage.show(new Message(type, message));
  }
}
