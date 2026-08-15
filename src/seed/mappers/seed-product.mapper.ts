import { Gender } from "../../../modules/products/domain/model/gender";
import { ProductImageSaveCommand } from "../../../modules/products/domain/model/commands/product-image-save-command";
import { ProductSaveCommand } from "../../../modules/products/domain/model/commands/product-save-command";
import { Size } from "../../../modules/shared/ui-state/domain/model/size";
import {
  Country,
  Product,
  SeedUser,
} from "../../../ui/features/product/interfaces/product.interface";
import { UserSeedSaveCommand } from "../../../modules/auth/domain/model/commands/user-seed-save-command";
import { CategorySaveCommand } from "../../../modules/products/domain/model/commands/category-save-command";
import { SaveCountryCommand } from "../../../modules/geography/domain/model/commands/save-country-command";

export const toProductSaveCommand = (
  product: Product,
  categoryId: string,
): ProductSaveCommand =>
  new ProductSaveCommand(
    product.description,
    product.title,
    product.inStock,
    product.price,
    product.sizes as Size[],
    product.slug,
    product.tags,
    product.gender as Gender,
    categoryId,
  );

export const toProductImageSaveCommand = (
  url: string,
  productId: string,
): ProductImageSaveCommand => new ProductImageSaveCommand(url, productId);

export const toUserSeedSaveCommand = (seedUser: SeedUser) =>
  new UserSeedSaveCommand(
    seedUser.name,
    seedUser.email,
    seedUser.password,
    seedUser.role,
    seedUser.image,
    seedUser.emailVerified,
    seedUser.emailVerificationToken,
    seedUser.emailVerificationExpires,
  );

export const toCountrySeedCommand = (countrySeed: Country) =>
  new SaveCountryCommand(countrySeed.name, countrySeed.id);
