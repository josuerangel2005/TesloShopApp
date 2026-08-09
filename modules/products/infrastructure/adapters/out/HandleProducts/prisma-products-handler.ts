import { Gender, Prisma } from "@/generated/prisma/client";
import { Category } from "../../../../domain/model/category";
import { CategorySaveCommand } from "../../../../domain/model/commands/category-save-command";
import { ForHandleProducts } from "../../../../domain/ports/drivens/for-handle-products";
import { prisma } from "./persistence/prisma/prisma";
import { CategoryNotExistsException } from "../../../../domain/error/category-not-exists-exception";
import { ProductSaveCommand } from "../../../../domain/model/commands/product-save-command";
import { ProductImageSaveCommand } from "../../../../domain/model/commands/product-image-save-command";
import { Product } from "../../../../domain/model/product";
import { ProductNotExistsException } from "../../../../domain/error/product-not-exists-exception";

export class PrismaProductsHandler implements ForHandleProducts {
  private readonly prismaClient: typeof prisma;

  constructor(prismaClient: typeof prisma) {
    this.prismaClient = prismaClient;
  }

  public async deleteAll(): Promise<void> {
    await Promise.all([
      prisma.product.deleteMany(),
      prisma.productImage.deleteMany(),
      prisma.category.deleteMany(),
    ]);
  }

  public async saveAllCategories(
    categories: CategorySaveCommand[],
  ): Promise<void> {
    await this.prismaClient.category.createMany({
      data: categories.map((category) => ({ name: category.getName() })),
    });
  }

  public async getCategoryByName(name: string): Promise<Category> {
    try {
      const data = await this.prismaClient.category.findFirstOrThrow({
        where: {
          name,
        },
      });
      return new Category(data.id, data.name);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new CategoryNotExistsException(name);
      throw error;
    }
  }

  public async saveAllProducts(products: ProductSaveCommand[]): Promise<void> {
    await this.prismaClient.product.createMany({
      data: products.map((product) => ({
        title: product.getTitle(),
        description: product.getDescription(),
        inStock: product.getInStock(),
        price: product.getPrice(),
        slug: product.getSlug(),
        gender: product.getGender().toString() as Gender,
        sizes: product.getSizes(),
        tags: product.getTags(),
        categoryId: product.getCategoryId(),
      })),
    });
  }

  public async saveAllImageProducts(
    images: ProductImageSaveCommand[],
  ): Promise<void> {
    await this.prismaClient.productImage.createMany({
      data: images.map((img) => ({
        url: img.getUrl(),
        productId: img.getProductId(),
      })),
    });
  }

  public async getProductBySlug(slug: string): Promise<string> {
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
      throw error;
    }
  }
}
