"use client";

import { IoTrashOutline } from "react-icons/io5";
import { deleteProductByIdAction } from "../actions/delete-product-by-id-action";

interface Props {
  productId: string;
}

export const DeleteProductButton = ({ productId }: Props) => {
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
      onClick={async () => await deleteProductByIdAction(productId)}
    >
      <IoTrashOutline size={15} />
      Eliminar
    </button>
  );
};
