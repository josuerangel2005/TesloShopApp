import { CategorySaveCommand } from "../../modules/products/domain/model/commands/category-save-command";
import { ProductImageSaveCommand } from "../../modules/products/domain/model/commands/product-image-save-command";
import { ProductSaveCommand } from "../../modules/products/domain/model/commands/product-save-command";
import { Gender } from "../../modules/products/domain/model/gender";
import { Size } from "../../modules/products/domain/model/size";
import { getHandleProductsUseCase } from "../../modules/products/infrastructure/config/factory/handle-products-use-case-factory";
import { initialData } from "./seed";

async function main() {
  const handleProductsUseCase = getHandleProductsUseCase();

  // Borrar todos los registros de base de datos
  await handleProductsUseCase.deleteAll();

  const { categories, products } = initialData;

  //Añadir categorias
  await handleProductsUseCase.saveAllCategories(
    categories.map((category) => new CategorySaveCommand(category)),
  );

  //Añadir productos

  //1. Obtener las categorias por id y persistir productos

  await handleProductsUseCase.saveAllProducts(
    await Promise.all(
      products.map(
        async (product) =>
          new ProductSaveCommand(
            product.description,
            product.title,
            product.inStock,
            product.price,
            product.sizes as Size[],
            product.slug,
            product.tags,
            product.gender as Gender,
            (
              await handleProductsUseCase.getCategoryByName(product.type)
            ).getId(),
          ),
      ),
    ),
  );

  //persistir imágenes de cada producto

  await handleProductsUseCase.saveAllImageProducts(
    await Promise.all(
      products.flatMap((product) =>
        product.images.map(
          async (img) =>
            new ProductImageSaveCommand(
              img,
              await handleProductsUseCase.getProductIdBySlug(product.slug),
            ),
        ),
      ),
    ),
  );
  console.log("Seed Executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
