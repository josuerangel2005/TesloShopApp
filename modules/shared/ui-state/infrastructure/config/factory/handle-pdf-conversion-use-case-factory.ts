import { HandlePdfConversionUseCase } from "../../../application/usecases/handle-pdf-conversion-use-case";
import { PdfShiftDocumentConverterAdapter } from "../../adapters/out/PdfConversion/pdfshift-document-converter-adapter";

const pdfShiftDocumentConverterAdapter = new PdfShiftDocumentConverterAdapter();

export const getHandlePdfConversionUseCase = () =>
  new HandlePdfConversionUseCase(pdfShiftDocumentConverterAdapter);