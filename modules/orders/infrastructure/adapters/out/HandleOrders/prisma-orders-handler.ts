import { prisma } from "../../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { PersisteOrderErrorException } from "../../../../domain/error/persistence-order-error-exception";
import { ProductInStockZeroException } from "../../../../domain/error/product-in-stock-zero-exception";
import { ProductNotExistsException } from "../../../../domain/error/product-not-exists-exception";
import { ProductQuantityZeroException } from "../../../../domain/error/product-quantity-zero-exception";
import { OrderSaveCommand } from "../../../../domain/model/commands/order-save-command";
import { calculateOrderTotals } from "../../../../domain/model/order-tax";
import { Order } from "../../../../domain/model/order";
import { ForHandleOrders } from "../../../../domain/ports/driven/for-handle-orders";
import { toOrderDomainMapper } from "./utils/mappers/to-order-domain-mapper";
import { Prisma } from "@/generated/prisma/client";
import { OrderWithIdNotExistsException } from "../../../../domain/error/order-with-id-not-exists-exception";
import { OrderNotExistsException } from "../../../../domain/error/order-not-exists-exception";

export class PrismaOrdersHandler implements ForHandleOrders {
  private readonly prismaClient: typeof prisma;

  constructor(prismaClient: typeof prisma) {
    this.prismaClient = prismaClient;
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return (
        await this.prismaClient.order.findMany({
          include: {
            orderItems: true,
            orderAddresses: { include: { country: true } },
          },
        })
      ).map(toOrderDomainMapper);
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to find all orders: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async saveOrder(order: OrderSaveCommand): Promise<string> {
    try {
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: order.getOrderItems().map((item) => item.getProductId()),
          },
        },
      });

      const foundProductIds = new Set(products.map((product) => product.id));

      for (const item of order.getOrderItems()) {
        if (!foundProductIds.has(item.getProductId())) {
          throw new ProductNotExistsException(item.getProductId());
        }
      }

      const productPriceById = new Map(
        products.map((product) => [product.id, product.price]),
      );

      const subTotal = order
        .getOrderItems()
        .reduce(
          (acc, item) =>
            acc +
            (productPriceById.get(item.getProductId()) ?? 0) *
              item.getQuantity(),
          0,
        );

      const { tax, total } = calculateOrderTotals(subTotal);

      const itemsInOrder = order
        .getOrderItems()
        .reduce((acc, item) => acc + item.getQuantity(), 0);

      return await prisma.$transaction(async (tx) => {
        const updatedProductsPromises = products.map((product) => {
          const productQuantity = order
            .getOrderItems()
            .filter((p) => p.getProductId() === product.id)
            .reduce((acc, crv) => acc + crv.getQuantity(), 0);

          if (productQuantity === 0)
            throw new ProductQuantityZeroException(product.title);

          return tx.product.update({
            where: { id: product.id },
            data: {
              inStock: {
                decrement: productQuantity,
              },
            },
          });
        });

        const updatedProducts = await Promise.all(updatedProductsPromises);

        //Verificar valores negativos en las existencia = no hay stock
        updatedProducts.forEach((prod) => {
          if (prod?.inStock < 0)
            throw new ProductInStockZeroException(prod.title);
        });

        const orderSave = await tx.order.create({
          data: {
            userId: order.getUserId(),
            itemsInOrder,
            subTotal,
            tax,
            total,

            orderItems: {
              createMany: {
                data: order.getOrderItems().map((p) => ({
                  quantity: p.getQuantity(),
                  size: p.getSize(),
                  productId: p.getProductId(),
                  price: productPriceById.get(p.getProductId()) ?? 0,
                })),
              },
            },
          },
        });

        await tx.orderAddress.create({
          data: {
            firstName: order.getOrderAddress()?.getFirstName(),
            lastName: order.getOrderAddress()?.getLastName(),
            address: order.getOrderAddress()?.getAddress(),
            address2: order.getOrderAddress()?.getAddress2(),
            postalCode: order.getOrderAddress()?.getPostalCode(),
            city: order.getOrderAddress()?.getCity(),
            phone: order.getOrderAddress()?.getPhone(),
            countryId: order.getOrderAddress()?.getCountryId(),
            orderId: orderSave.id,
          },
        });

        return orderSave.id;
      });
    } catch (error) {
      if (
        error instanceof ProductQuantityZeroException ||
        error instanceof ProductInStockZeroException ||
        error instanceof ProductNotExistsException
      ) {
        throw error;
      }
      throw new PersisteOrderErrorException(
        `Error to save order: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteAllOrders(): Promise<void> {
    try {
      await this.prismaClient.order.deleteMany();
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to delete all orders: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteAllOrderAddress(): Promise<void> {
    try {
      await this.prismaClient.orderAddress.deleteMany();
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to delete all orders address: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteAllOrderItems(): Promise<void> {
    try {
      await this.prismaClient.orderItem.deleteMany();
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to delete all orders items: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      return (
        await this.prismaClient.order.findMany({
          where: { userId },
          include: {
            orderItems: true,
            orderAddresses: { include: { country: true } },
          },
        })
      ).map(toOrderDomainMapper);
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to find order with userId ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getPendingOrdersCountByUserId(userId: string): Promise<number> {
    try {
      return await this.prismaClient.order.count({
        where: { userId, isPaid: false },
      });
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to count pending orders with userId ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      return toOrderDomainMapper(
        await this.prismaClient.order.findFirstOrThrow({
          where: {
            id: orderId,
          },
          include: {
            orderItems: true,
            orderAddresses: { include: { country: true } },
          },
        }),
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new OrderWithIdNotExistsException(orderId);

      throw new PersisteOrderErrorException(
        `Error to find order with orderId ${orderId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteOrderById(orderId: string): Promise<void> {
    try {
      await this.prismaClient.$transaction(async (tx) => {
        const items = await tx.orderItem.findMany({ where: { orderId } });

        await Promise.all(
          items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { inStock: { increment: item.quantity } },
            }),
          ),
        );

        await tx.orderItem.deleteMany({ where: { orderId } });
        await tx.orderAddress.deleteMany({ where: { orderId } });
        await tx.order.delete({ where: { id: orderId } });
      });
    } catch (error) {
      throw new PersisteOrderErrorException(
        `Error to delete order with orderId ${orderId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async setTransactionId(
    orderId: string,
    transactionId: string,
  ): Promise<void> {
    try {
      await this.prismaClient.order.update({
        where: { id: orderId },
        data: { transactionId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new OrderWithIdNotExistsException(orderId);

      throw new PersisteOrderErrorException(
        `Failed to set transactionId where orderId is: ${orderId}, ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updatePaymentStatus(orderId: string): Promise<void> {
    try {
      await this.prismaClient.order.update({
        where: { id: orderId },
        data: { isPaid: true, paidAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new OrderWithIdNotExistsException(orderId);

      throw new PersisteOrderErrorException(
        `Failed to update payment status where orderId is: ${orderId}, ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
