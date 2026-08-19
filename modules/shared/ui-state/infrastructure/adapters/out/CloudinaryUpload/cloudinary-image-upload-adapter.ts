import { v2 as cloudinary } from "cloudinary";
import { ImageUpload } from "../../../../domain/model/image-upload";
import { ForImageUpload } from "../../../../domain/ports/for-image-upload";
import { CloudinaryDeleteException } from "../../../../domain/error/clodinary-delete-exception";

export class CloudinaryImageUploadAdapter implements ForImageUpload {
  async upload(image: ImageUpload): Promise<string> {
    const dataUri = `data:${image.getMimeType()};base64,${image.getBuffer().toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "teslo/avatars",
    });

    return result.secure_url;
  }

  async removeImageByUrl(secureUrl: string): Promise<void> {
    const publicId = secureUrl.split("/").slice(-2).join("/").split(".")[0];
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found")
      throw new CloudinaryDeleteException(
        `Failed to delete image: ${result.result}`,
      );
  }
}
