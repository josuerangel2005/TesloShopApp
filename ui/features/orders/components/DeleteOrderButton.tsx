"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { deleteOrderAction } from "../actions/delete-order-action";
import { getHandlePendingNumberOrdersFactory } from "../../../../modules/shared/ui-state/infrastructure/config/factory/handle-pending-number-orders-factory";

interface Props {
  orderId: string;
}

export const DeleteOrderButton = ({ orderId }: Props) => {
  const [isPending, setIsPending] = useState(false);
  const handlePendingNumberOrdes = getHandlePendingNumberOrdersFactory();
  const router = useRouter();
  const path = usePathname();

  const handleDelete = async () => {
    setIsPending(true);
    const result = await deleteOrderAction(orderId);

    if (result.ok) {
      handlePendingNumberOrdes.deletePendingOrder();
      setIsPending(false);
      if (result.remaining === 0) router.push("/");
    } else {
      console.log(result.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="cursor-pointer inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-colors hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      <IoTrashOutline size={14} />
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
};
