import { ValidationResult } from "../../../../domain/model/validation-result";
import { ForValidateProduct } from "../../../../domain/ports/drivens/for-validate-product";
import {
  categorySchema,
  descriptionScheme,
  genderSchema,
  idScheme,
  imagesQuantityScheme,
  inStockScheme,
  priceScheme,
  sizesScheme,
  slugScheme,
  tagsScheme,
  titleScheme,
} from "./product-schema";

export class ZodValidateAdapter implements ForValidateProduct {
  private readonly genderValidator: typeof genderSchema;
  private readonly categoryValidator: typeof categorySchema;
  private readonly titleValidator: typeof titleScheme;
  private readonly descriptionValidator: typeof descriptionScheme;
  private readonly inStockValidator: typeof inStockScheme;
  private readonly priceValidator: typeof priceScheme;
  private readonly sizesValidator: typeof sizesScheme;
  private readonly slugValidator: typeof slugScheme;
  private readonly tagsValidator: typeof tagsScheme;
  private readonly imagesQuantityValidator: typeof imagesQuantityScheme;

  constructor(
    genderValidator: typeof genderSchema,
    categoryValidator: typeof categorySchema,
    titleValidator: typeof titleScheme,
    descriptionValidator: typeof descriptionScheme,
    inStockValidator: typeof inStockScheme,
    priceValidator: typeof priceScheme,
    sizesValidator: typeof sizesScheme,
    slugValidator: typeof slugScheme,
    tagsValidator: typeof tagsScheme,
    imagesQuantityValidator: typeof imagesQuantityScheme,
  ) {
    this.genderValidator = genderValidator;
    this.categoryValidator = categoryValidator;
    this.titleValidator = titleValidator;
    this.descriptionValidator = descriptionValidator;
    this.inStockValidator = inStockValidator;
    this.priceValidator = priceValidator;
    this.sizesValidator = sizesValidator;
    this.slugValidator = slugValidator;
    this.tagsValidator = tagsValidator;
    this.imagesQuantityValidator = imagesQuantityValidator;
  }

  public validateAll(
    title: string,
    slug: string,
    description: string,
    price: number,
    tags: string[],
    gender: string,
    category: string,
    sizes: string[],
    imagesQuantity: number,
    stock: number,
  ): ValidationResult {
    const genderErrors = this.validateGender(gender);
    const categoryErrors = this.validateCategory(category);
    const titleErrors = this.validateTitle(title);
    const slugErrors = this.validateSlug(slug);
    const descriptionErrors = this.validateDescription(description);
    const priceErrors = this.validatePrice(price);
    const tagsErrors = this.validateTags(tags);
    const sizesErrors = this.validateSizes(sizes);
    const imagesQuantityErrors = this.validateImagesQuantity(imagesQuantity);
    const stockErrors = this.validateStock(stock);

    if (
      genderErrors ||
      categoryErrors ||
      titleErrors ||
      slugErrors ||
      descriptionErrors ||
      priceErrors ||
      tagsErrors ||
      sizesErrors ||
      imagesQuantityErrors ||
      stockErrors
    )
      return {
        success: false,
        fieldErrors: {
          title: titleErrors,
          slug: slugErrors,
          description: descriptionErrors,
          price: priceErrors,
          tags: tagsErrors,
          gender: genderErrors,
          category: categoryErrors,
          sizes: sizesErrors,
          imagesQuantity: imagesQuantityErrors,
          inStock: stockErrors,
        },
      };

    return { success: true };
  }

  public validateTitle(title: string): string | undefined {
    const result = this.titleValidator.safeParse(title);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateSlug(slug: string): string | undefined {
    const result = this.slugValidator.safeParse(slug);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateDescription(description: string): string | undefined {
    const result = this.descriptionValidator.safeParse(description);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validatePrice(price: number): string | undefined {
    const result = this.priceValidator.safeParse(price);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateTags(tags: string[]): string | undefined {
    const result = this.tagsValidator.safeParse(tags);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateGender(gender: string): string | undefined {
    const result = this.genderValidator.safeParse(gender);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateSizes(sizes: string[]): string | undefined {
    const result = this.sizesValidator.safeParse(sizes);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateStock(stock: number): string | undefined {
    const result = this.inStockValidator.safeParse(stock);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateCategory(category: string): string | undefined {
    const result = this.categoryValidator.safeParse(category);
    return result.success ? undefined : result.error.issues[0].message;
  }

  public validateImagesQuantity(quantity: number): string | undefined {
    const result = this.imagesQuantityValidator.safeParse(quantity);
    return result.success ? undefined : result.error.issues[0].message;
  }
}
