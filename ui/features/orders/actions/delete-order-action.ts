"use server";

import { revalidatePath } from "next/cache";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

export const deleteOrderAction = async (
  orderId: string,
): Promise<{ ok: boolean; message?: string }> => {
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

    revalidatePath("/profile");
    revalidatePath("/orders");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error al eliminar la orden",
    };
  }
};