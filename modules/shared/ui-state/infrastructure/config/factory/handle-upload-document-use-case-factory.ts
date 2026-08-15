import { HandleUploadDocumentUseCase } from "../../../application/usecases/handle-upload-document-use-case";
import { CloudinaryDocumentUploadAdapter } from "../../adapters/out/CloudinaryUpload/cloudinary-document-upload-adapter";

const cloudinaryDocumentUploadAdapter = new CloudinaryDocumentUploadAdapter();

export const getHandleUploadDocumentUseCase = () =>
  new HandleUploadDocumentUseCase(cloudinaryDocumentUploadAdapter);