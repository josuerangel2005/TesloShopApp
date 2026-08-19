import { ImageUpload } from "../../domain/model/image-upload";
import { ForImageUpload } from "../../domain/ports/for-image-upload";

export class HandleUploadImageUseCase {
  private readonly forImageUpload: ForImageUpload;

  constructor(forImageUpload: ForImageUpload) {
    this.forImageUpload = forImageUpload;
  }

  public upload(image: ImageUpload): Promise<string> {
    return this.forImageUpload.upload(image);
  }

  public removeImageByUrl(secureUrl: string): Promise<void> {
    return this.forImageUpload.removeImageByUrl(secureUrl);
  }
}
