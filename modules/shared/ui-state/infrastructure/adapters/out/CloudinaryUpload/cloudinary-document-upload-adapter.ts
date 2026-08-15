import { v2 as cloudinary } from "cloudinary";
import { DocumentUpload } from "../../../../domain/model/document-upload";
import { ForDocumentUpload } from "../../../../domain/ports/for-document-upload";

export class CloudinaryDocumentUploadAdapter implements ForDocumentUpload {
  async upload(document: DocumentUpload): Promise<string> {
    if (document.getMimeType() !== "application/pdf") {
      throw new Error("Solo se permiten archivos PDF.");
    }

    const dataUri = `data:${document.getMimeType()};base64,${document.getBuffer().toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      folder: "teslo/documents",
      use_filename: true,
      unique_filename: true,
    });

    return result.secure_url;
  }
}