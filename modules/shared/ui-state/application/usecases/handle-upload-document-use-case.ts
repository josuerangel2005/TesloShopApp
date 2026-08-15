import { DocumentUpload } from "../../domain/model/document-upload";
import { ForDocumentUpload } from "../../domain/ports/for-document-upload";

export class HandleUploadDocumentUseCase {
  private readonly forDocumentUpload: ForDocumentUpload;

  constructor(forDocumentUpload: ForDocumentUpload) {
    this.forDocumentUpload = forDocumentUpload;
  }

  public upload(document: DocumentUpload): Promise<string> {
    return this.forDocumentUpload.upload(document);
  }
}