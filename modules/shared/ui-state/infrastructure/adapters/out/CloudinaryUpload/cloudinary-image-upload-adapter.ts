import { v2 as cloudinary } from "cloudinary";
import { ImageUpload } from "../../../../domain/model/image-upload";
import { ForImageUpload } from "../../../../domain/ports/for-image-upload";

export class CloudinaryImageUploadAdapter implements ForImageUpload {
  async upload(image: ImageUpload): Promise<string> {
    const dataUri = `data:${image.getMimeType()};base64,${image.getBuffer().toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "teslo/avatars",
    });

    return result.secure_url;
  }
}
