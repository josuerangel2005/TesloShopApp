export class DocumentUpload {
  constructor(
    private readonly buffer: Buffer,
    private readonly mimeType: string,
    private readonly filename: string,
  ) {}

  getBuffer(): Buffer {
    return this.buffer;
  }
  getMimeType(): string {
    return this.mimeType;
  }
  getFilename(): string {
    return this.filename;
  }
}