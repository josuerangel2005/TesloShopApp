import { ValidateProductUseCase } from "../../../application/usecases/validate-product-use-case";
import {
  categorySchema,
  descriptionScheme,
  genderSchema,
  imagesQuantityScheme,
  inStockScheme,
  priceScheme,
  sizesArrayScheme,
  slugScheme,
  tagsScheme,
  titleScheme,
} from "../../adapters/out/Validate/product-schema";
import { ZodValidateAdapter } from "../../adapters/out/Validate/zod-validate-adapter";

const zodValidateAdapter = new ZodValidateAdapter(
  genderSchema,
  categorySchema,
  titleScheme,
  descriptionScheme,
  inStockScheme,
  priceScheme,
  sizesArrayScheme,
  slugScheme,
  tagsScheme,
  imagesQuantityScheme,
);

export const getValidateProductUseCase = () =>
  new ValidateProductUseCase(zodValidateAdapter);
