import { HandleInvoiceGenerationUseCase } from "../../../application/usecases/handle-invoice-generation-use-case";
import { SpringInvoiceGenerationAdapter } from "../../adapters/out/InvoiceGeneration/spring-invoice-generation-adapter";

const springInvoiceGenerationAdapter = new SpringInvoiceGenerationAdapter();

export const getHandleInvoiceGenerationUseCase = () =>
  new HandleInvoiceGenerationUseCase(springInvoiceGenerationAdapter);