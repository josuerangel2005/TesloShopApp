import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";

export const AddProductButton = () => {
  return (
    <Link
      href={"/admin/product"}
      type="button"
      className="btn-primary"
      aria-label="Añadir producto"
    >
      <IoAddOutline size={18} />
      Añadir producto
    </Link>
  );
};
