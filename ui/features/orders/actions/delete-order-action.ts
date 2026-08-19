"use server";

import { revalidatePath } from "next/cache";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

export const deleteOrderAction = async (
  orderId: string,
): Promise<
  { ok: false; message?: string } | { ok: true; remaining: number }
> => {
  try {
    const session = await getHandleAuthUseCase().getSession();
    if (!session) return { ok: false, message: "Debes iniciar sesión" };

    const user = await getHandleAuthUseCase().getCurrentUser();
    const isAdmin = user?.getRole().toString() === "ADMIN";

    await getHandleOrdersUseCase().deleteOrderById(
      orderId,
      session.getId(),
      isAdmin,
    );

    const remaining =
      await getHandleOrdersUseCase().getPendingOrdersCountByUserId(
        session.getId(),
      );

    if (remaining !== 0) {
      revalidatePath("/profile");
      revalidatePath("/orders");
    }

    return { ok: true, remaining };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Error al eliminar la orden",
    };
  }
};
