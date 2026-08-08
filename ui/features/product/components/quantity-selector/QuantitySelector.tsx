"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  max: number;
  onQuantityChange: (value: number) => void;
}

export const QuantitySelector = ({
  quantity,
  max,
  onQuantityChange,
}: Props) => {
  return (
    <div
      aria-live="polite"
      className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white"
    >
      <button
        type="button"
        aria-label="Restar cantidad"
        disabled={quantity <= 1}
        onClick={() => onQuantityChange(quantity - 1)}
        className="flex size-12 items-center justify-center text-slate-600 cursor-pointer transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IoRemoveCircleOutline size={28} />
      </button>

      <span className="w-14 px-2 py-1.5 text-center text-lg font-semibold text-slate-800">
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Sumar cantidad"
        disabled={quantity >= max}
        onClick={() => onQuantityChange(quantity + 1)}
        className="flex size-12 items-center justify-center p-2 text-slate-600 cursor-pointer transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IoAddCircleOutline size={28} />
      </button>
    </div>
  );
};