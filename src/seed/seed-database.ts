import { CategorySaveCommand } from "../../modules/products/domain/model/commands/category-save-command";
import { getHandleProductsUseCase } from "../../modules/products/infrastructure/config/factory/handle-products-use-case-factory";
import { initialData } from "./seed";
import {
  toCountrySeedCommand,
  toProductImageSaveCommand,
  toProductSaveCommand,
  toUserSeedSaveCommand,
} from "./mappers/seed-product.mapper";
import { getHandleAuthUseCase } from "../../modules/auth";
import { getHandleCountriesUseCase } from "../../modules/geography/infrastructure/config/factory/handle-countries-use-case-factory";
import { getHandleOrdersUseCase } from "../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

async function main() {
  const handleProductsUseCase = getHandleProductsUseCase();
  const handleAuthUseCase = getHandleAuthUseCase();
  const handleCountriesUseCase = getHandleCountriesUseCase();
  const handleOrdersUseCase = getHandleOrdersUseCase();

  // Borrar todos los registros de base de datos (orden por FK: items -> direcciones -> ordenes -> productos)
  await handleOrdersUseCase.deleteAllOrderItems();
  await handleOrdersUseCase.deleteAllOrderAddress();
  await handleOrdersUseCase.deleteAllOrders();
  await handleProductsUseCase.deleteAll();

  const { categories, products, users, countries } = initialData;

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
            // Guardar ruta completa: los filenames del seed viven en /public/products
            img.includes("http") ? img : `/products/${img}`,
            await handleProductsUseCase.getProductIdBySlug(product.slug),
          ),
        ),
      ),
    ),
  );

  //Persistir usuarios
  await handleAuthUseCase.deleteAllUserAddresses();
  await handleAuthUseCase.deleteAllUsers();
  await handleAuthUseCase.saveAllUsersSeed(users.map(toUserSeedSaveCommand));

  //persistir countries
  await handleCountriesUseCase.deleteAllCountries();
  await handleCountriesUseCase.saveAllCountries(
    countries.map(toCountrySeedCommand),
  );

  console.log("Seed Executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
