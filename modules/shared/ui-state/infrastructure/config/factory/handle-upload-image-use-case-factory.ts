import { HandleUploadImageUseCase } from "../../../application/usecases/handle-upload-image-use-case";
import { CloudinaryImageUploadAdapter } from "../../adapters/out/CloudinaryUpload/cloudinary-image-upload-adapter";

const cloudinaryImageUploadAdapter = new CloudinaryImageUploadAdapter();

export const getHandleUploadImageUseCase = () =>
  new HandleUploadImageUseCase(cloudinaryImageUploadAdapter);
