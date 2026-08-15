import { DocumentUpload } from "../model/document-upload";

export interface ForDocumentUpload {
  upload: (document: DocumentUpload) => Promise<string>;
}