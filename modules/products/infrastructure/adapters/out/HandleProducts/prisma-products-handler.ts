import { Gender, Prisma } from "@/generated/prisma/client";
import { Category } from "../../../../domain/model/category";
import { CategorySaveCommand } from "../../../../domain/model/commands/category-save-command";
import { ForHandleProducts } from "../../../../domain/ports/drivens/for-handle-products";
import { prisma } from "../../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { CategoryNotExistsException } from "../../../../domain/error/category-not-exists-exception";
import { CategoryAlreadyExistsException } from "../../../../domain/error/category-already-exists-exception";
import { ProductsPersistenceException } from "../../../../domain/error/products-persistence-exception";
import { ProductAlreadyExistsException } from "../../../../domain/error/product-already-exists-exception";
import { ProductSaveCommand } from "../../../../domain/model/commands/product-save-command";
import { ProductImageSaveCommand } from "../../../../domain/model/commands/product-image-save-command";
import { ProductNotExistsException } from "../../../../domain/error/product-not-exists-exception";
import { Product } from "../../../../domain/model/product";
import { Gender as GenderModel } from "../../../../domain/model/gender";
import { categoryRowToDomain } from "./utils/category.mapper";
import { productRowToDomain } from "./utils/product.mapper";
import { ImageUpload } from "../../../../../shared/ui-state/domain/model/image-upload";
import { getHandleUploadImageUseCase } from "../../../../../shared/ui-state/infrastructure/config/factory/handle-upload-image-use-case-factory";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class PrismaProductsHandler implements ForHandleProducts {
  private readonly prismaClient: typeof prisma;

  constructor(prismaClient: typeof prisma) {
    this.prismaClient = prismaClient;
  }

  private toPrismaGender(gender: GenderModel): Gender {
    return gender.toString().toLowerCase() as Gender;
  }

  public async deleteAll(): Promise<void> {
    try {
      // Orden por FK: imagenes -> productos -> categorias
      await prisma.productImage.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
    } catch (error) {
      throw new ProductsPersistenceException(
        `Failed to delete all products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async saveAllCategories(
    categories: CategorySaveCommand[],
  ): Promise<void> {
    try {
      await this.prismaClient.category.createMany({
        data: categories.map((category) => ({ name: category.getName() })),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new CategoryAlreadyExistsException(
          categories.map((category) => category.getName()).join(", "),
        );
      throw new ProductsPersistenceException(
        `Failed to save categories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getCategoryByName(name: string): Promise<Category> {
    try {
      const data = await this.prismaClient.category.findFirstOrThrow({
        where: {
          name,
        },
      });
      return categoryRowToDomain(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new CategoryNotExistsException(name);
      throw new ProductsPersistenceException(
        `Failed to get category by name: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async saveAllProducts(products: ProductSaveCommand[]): Promise<void> {
    try {
      await this.prismaClient.product.createMany({
        data: products.map((product) => ({
          title: product.getTitle(),
          description: product.getDescription(),
          inStock: product.getInStock(),
          price: product.getPrice(),
          slug: product.getSlug(),
          gender: this.toPrismaGender(product.getGender()),
          sizes: product.getSizes(),
          tags: product.getTags(),
          categoryId: product.getCategoryId(),
        })),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new ProductAlreadyExistsException(products[0].getSlug());
      throw new ProductsPersistenceException(
        `Failed to save products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async saveAllImageProducts(
    images: ProductImageSaveCommand[],
  ): Promise<void> {
    try {
      await this.prismaClient.productImage.createMany({
        data: images.map((img) => ({
          url: img.getUrl(),
          productId: img.getProductId(),
        })),
      });
    } catch (error) {
      throw new ProductsPersistenceException(
        `Failed to save product images: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getProductIdBySlug(slug: string): Promise<string> {
    try {
      return (
        await this.prismaClient.product.findFirstOrThrow({
          where: {
            slug,
          },
        })
      ).id;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new ProductNotExistsException(slug);
      throw new ProductsPersistenceException(
        `Failed to get product id by slug: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getAllProductsWithImages(
    page: number,
    take: number,
    search: string,
  ): Promise<Product[]> {
    try {
      const rows = await this.prismaClient.product.findMany({
        take,
        skip: (page - 1) * take,
        where: {
          title: { contains: search },
        },
        include: { category: true, productImages: true },
      });
      return rows.map((row) => productRowToDomain(row));
    } catch (error) {
      if (
        error instanceof CategoryNotExistsException ||
        error instanceof ProductsPersistenceException
      )
        throw error;
      throw new ProductsPersistenceException(
        `Failed to get products with images: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getQuantityProducts(search: string): Promise<number> {
    try {
      return await this.prismaClient.product.count({
        where: { title: { contains: search } },
      });
    } catch (error) {
      throw new ProductsPersistenceException(
        `Failed to count products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getProductsByGender(
    gender: GenderModel,
    page: number,
    take: number,
    search: string,
  ): Promise<Product[]> {
    try {
      const rows = await this.prismaClient.product.findMany({
        where: {
          gender: this.toPrismaGender(gender),
          title: { contains: search },
        },
        take,
        skip: (page - 1) * take,
        include: { category: true, productImages: true },
      });
      return rows.map((row) => productRowToDomain(row));
    } catch (error) {
      if (
        error instanceof CategoryNotExistsException ||
        error instanceof ProductsPersistenceException
      )
        throw error;
      throw new ProductsPersistenceException(
        `Failed to get products by gender: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getQuantityProductsByGender(
    gender: GenderModel,
    search: string,
  ): Promise<number> {
    try {
      return await this.prismaClient.product.count({
        where: {
          gender: this.toPrismaGender(gender),
          title: { contains: search },
        },
      });
    } catch (error) {
      throw new ProductsPersistenceException(
        `Failed to count products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getProductBySlug(slug: string): Promise<Product> {
    try {
      const data = await this.prismaClient.product.findFirstOrThrow({
        where: {
          slug,
        },
        include: { category: true, productImages: true },
      });

      return productRowToDomain(data);
    } catch (error) {
      if (
        error instanceof CategoryNotExistsException ||
        error instanceof ProductsPersistenceException
      )
        throw error;
      throw new ProductsPersistenceException(
        `Failed to get products by slug: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getProductsByIds(ids: string[]): Promise<Product[]> {
    try {
      const rows = await this.prismaClient.product.findMany({
        where: {
          id: { in: ids },
        },
        include: { category: true, productImages: true },
      });
      return rows.map((row) => productRowToDomain(row));
    } catch (error) {
      if (
        error instanceof CategoryNotExistsException ||
        error instanceof ProductsPersistenceException
      )
        throw error;
      throw new ProductsPersistenceException(
        `Failed to get products by ids: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async getStockByProductSlug(slug: string): Promise<number> {
    try {
      return (
        await this.prismaClient.product.findFirstOrThrow({
          where: {
            slug,
          },
        })
      ).inStock;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new ProductNotExistsException(slug);
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return (await this.prismaClient.category.findMany()).map(
        (row) => new Category(row.id, row.name),
      );
    } catch (error) {
      throw new ProductsPersistenceException(
        `Failed to get all categories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async saveProduct(
    productSave: ProductSaveCommand,
    imagesUpload: ImageUpload[],
  ): Promise<void> {
    const handleUploadImage = getHandleUploadImageUseCase();
    try {
      const urls = await Promise.all(
        imagesUpload.map(
          async (imageUpload) => await handleUploadImage.upload(imageUpload),
        ),
      );

      await this.prismaClient.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            title: productSave.getTitle(),
            description: productSave.getDescription(),
            inStock: productSave.getInStock(),
            price: productSave.getPrice(),
            slug: productSave.getSlug(),
            gender: this.toPrismaGender(productSave.getGender()),
            sizes: productSave.getSizes(),
            tags: productSave.getTags(),
            categoryId: productSave.getCategoryId(),
          },
        });

        await tx.productImage.createMany({
          data: urls.map((url) => ({
            url,
            productId: product.id,
          })),
        });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new ProductAlreadyExistsException(productSave.getSlug());
      throw new ProductsPersistenceException(
        `Failed to save product: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updateProduct(
    productSave: ProductSaveCommand,
    imagesUpload: ImageUpload[],
    productId: string,
    initialImages: string[],
  ): Promise<void> {
    try {
      const handleUploadImage = getHandleUploadImageUseCase();

      const urls = await Promise.all(
        imagesUpload.map(
          async (imageUpload) => await handleUploadImage.upload(imageUpload),
        ),
      );

      const currentUrls = (
        await this.prismaClient.productImage.findMany({
          where: { productId },
        })
      ).map((image) => image.url);

      const cloudinaryImagesToRemove = currentUrls.filter(
        (url) => !initialImages.includes(url),
      );

      const cloudinaryImagesToPersist = currentUrls.filter(
        (url) => !cloudinaryImagesToRemove.includes(url),
      );

      await Promise.all(
        cloudinaryImagesToRemove.map(
          async (url) => await handleUploadImage.removeImageByUrl(url),
        ),
      );

      await this.prismaClient.$transaction(async (tx) => {
        await tx.productImage.deleteMany({
          where: { productId },
        });

        const product = await tx.product.update({
          where: { id: productId },
          data: {
            title: productSave.getTitle(),
            description: productSave.getDescription(),
            inStock: productSave.getInStock(),
            price: productSave.getPrice(),
            slug: productSave.getSlug(),
            gender: this.toPrismaGender(productSave.getGender()),
            sizes: productSave.getSizes(),
            tags: productSave.getTags(),
            categoryId: productSave.getCategoryId(),
          },
        });

        await tx.productImage.createMany({
          data: [...urls, ...cloudinaryImagesToPersist].map((url) => ({
            url,
            productId: product.id,
          })),
        });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new ProductNotExistsException(productId);

      throw new ProductsPersistenceException(
        `Failed to update product: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteProductById(productId: string): Promise<void> {
    const handleUploadImage = getHandleUploadImageUseCase();
    try {
      await this.prismaClient.$transaction(async (tx) => {
        const imagesUrl = (
          await tx.productImage.findMany({
            where: { productId },
          })
        ).map((image) => image.url);

        await Promise.all(
          imagesUrl.map(
            async (url) => await handleUploadImage.removeImageByUrl(url),
          ),
        );

        await prisma.productImage.deleteMany({
          where: {
            productId,
          },
        });
        await prisma.product.delete({
          where: { id: productId },
        });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new ProductNotExistsException(productId);

      throw new ProductsPersistenceException(
        `Failed to delete product: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
