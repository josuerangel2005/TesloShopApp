import { Message } from "../../../../domain/model/message";
import { ForShowMessage } from "../../../../domain/ports/for-show-message";
import toast from "react-hot-toast";

export class ToastShowMessageAdapter implements ForShowMessage {
  public show(message: Message): void {
    message.getType() === "success"
      ? toast.success(message.getMessage(), {
          position: "top-right",
          duration: 7000,
        })
      : toast.error(message.getMessage(), {
          position: "top-right",
          duration: 7000,
        });
  }
}
