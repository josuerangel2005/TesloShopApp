import { Gender, Prisma } from "@/generated/prisma/client";
import { Category } from "../../../../domain/model/category";
import { CategorySaveCommand } from "../../../../domain/model/commands/category-save-command";
import { ForHandleProducts } from "../../../../domain/ports/drivens/for-handle-products";
import { prisma } from "./persistence/prisma/prisma";
import { CategoryNotExistsException } from "../../../../domain/error/category-not-exists-exception";
import { ProductSaveCommand } from "../../../../domain/model/commands/product-save-command";
import { ProductImageSaveCommand } from "../../../../domain/model/commands/product-image-save-command";
import { ProductNotExistsException } from "../../../../domain/error/product-not-exists-exception";
import { Product } from "../../../../domain/model/product";
import { ProductImage } from "../../../../domain/model/productImage";
import { ProductImageNotExistsException } from "../../../../domain/error/product-image-not-exists-exception";
import { Size } from "../../../../domain/model/size";
import { Gender as GenderModel } from "../../../../domain/model/gender";

export class PrismaProductsHandler implements ForHandleProducts {
  private readonly prismaClient: typeof prisma;

  constructor(prismaClient: typeof prisma) {
    this.prismaClient = prismaClient;
  }

  public async deleteAll(): Promise<void> {
    try {
      await Promise.all([
        prisma.product.deleteMany(),
        prisma.productImage.deleteMany(),
        prisma.category.deleteMany(),
      ]);
    } catch (error) {
      throw error;
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
      throw error;
    }
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

  public async getCategoryById(categoryId: string): Promise<Category> {
    try {
      const data = await this.prismaClient.category.findFirstOrThrow({
        where: {
          id: categoryId,
        },
      });
      return new Category(data.id, data.name);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new CategoryNotExistsException(categoryId);
      throw error;
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
          gender: product.getGender().toString() as Gender,
          sizes: product.getSizes(),
          tags: product.getTags(),
          categoryId: product.getCategoryId(),
        })),
      });
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  public async getAllProductsWithImages(): Promise<Product[]> {
    try {
      return await Promise.all(
        (await this.prismaClient.product.findMany()).map(
          async (prismaProduct) =>
            new Product(
              prismaProduct.id,
              prismaProduct.title,
              prismaProduct.description,
              prismaProduct.inStock,
              prismaProduct.price,
              prismaProduct.sizes as Size[],
              prismaProduct.slug,
              prismaProduct.tags,
              prismaProduct.gender as GenderModel,
              await this.getCategoryById(prismaProduct.categoryId),
              await this.getImagesByProductId(prismaProduct.id),
            ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  public async getImageByProductId(productId: string): Promise<ProductImage> {
    try {
      const data = await this.prismaClient.productImage.findFirstOrThrow({
        where: {
          productId,
        },
      });
      return new ProductImage(data.id, data.url, data.productId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new ProductImageNotExistsException(productId);
      throw error;
    }
  }

  public async getImagesByProductId(productId: string): Promise<ProductImage[]> {
    try {
      const data = await this.prismaClient.productImage.findMany({
        where: { productId },
      });
      return data.map((img) => new ProductImage(img.id, img.url, img.productId));
    } catch (error) {
      throw error;
    }
  }
}
