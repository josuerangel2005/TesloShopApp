"use client";
import Link from "next/link";
import { IoCardOutline } from "react-icons/io5";

export const TopMenuPendingOrdersCount = ({
  pendingOrdersCount,
}: {
  pendingOrdersCount: number;
}) => {
  return (
    <Link
      href={"/orders"}
      aria-label="Órdenes pendientes"
      className="relative p-2 rounded-md text-slate-600 transition-all duration-200 hover:bg-gray-100 hover:text-slate-900 active:scale-90"
    >
      <IoCardOutline className="w-5 h-5" />
      {pendingOrdersCount > 0 && (
        <span
          key={pendingOrdersCount}
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white [animation:cartPop_0.35s_ease-out]"
        >
          {pendingOrdersCount}
        </span>
      )}
    </Link>
  );
};
