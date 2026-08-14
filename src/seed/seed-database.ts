import { CategorySaveCommand } from "../../modules/products/domain/model/commands/category-save-command";
import { getHandleProductsUseCase } from "../../modules/products/infrastructure/config/factory/handle-products-use-case-factory";
import { initialData } from "./seed";
import {
  toProductImageSaveCommand,
  toProductSaveCommand,
  toUserSeedSaveCommand,
} from "./mappers/seed-product.mapper";
import { getHandleAuthUseCase } from "../../modules/auth";

async function main() {
  const handleProductsUseCase = getHandleProductsUseCase();
  const handleAuthUseCase = getHandleAuthUseCase();

  // Borrar todos los registros de base de datos
  await handleProductsUseCase.deleteAll();

  const { categories, products, users } = initialData;

  //Añadir categorias
  await handleProductsUseCase.saveAllCategories(
    categories.map((category) => new CategorySaveCommand(category)),
  );

  //Añadir productos

  //1. Obtener las categorias por id y persistir productos

  await handleProductsUseCase.saveAllProducts(
    await Promise.all(
      products.map(async (product) =>
        toProductSaveCommand(
          product,
          (await handleProductsUseCase.getCategoryByName(product.type)).getId(),
        ),
      ),
    ),
  );

  //persistir imágenes de cada producto

  await handleProductsUseCase.saveAllImageProducts(
    await Promise.all(
      products.flatMap((product) =>
        product.images.map(async (img) =>
          toProductImageSaveCommand(
            img,
            await handleProductsUseCase.getProductIdBySlug(product.slug),
          ),
        ),
      ),
    ),
  );

  //Persistir usuarios
  await handleAuthUseCase.deleteAllUsers();
  await handleAuthUseCase.saveAllUsersSeed(users.map(toUserSeedSaveCommand));

  console.log("Seed Executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
