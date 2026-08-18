"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { deleteOrderAction } from "../actions/delete-order-action";

interface Props {
  orderId: string;
}

export const DeleteOrderButton = ({ orderId }: Props) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteOrderAction(orderId);
      if (result.ok) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } finally {
      setIsPending(false);
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
