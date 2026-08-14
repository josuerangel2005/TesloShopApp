import { ImageUpload } from "../model/image-upload";

export interface ForImageUpload {
  upload: (image: ImageUpload) => Promise<string>;
}
