export interface ForPdfConversion {
  convert: (html: string) => Promise<Buffer>;
}