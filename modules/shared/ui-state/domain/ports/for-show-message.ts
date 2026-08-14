import { Message } from "../model/message";

export interface ForShowMessage {
  show: (message: Message) => void;
}
