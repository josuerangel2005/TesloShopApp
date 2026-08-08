"use client";

import clsx from "clsx";
import { ValidSizes } from "../../interfaces/product.interface";

interface Props {
  selectedSize: ValidSizes | undefined;
  availableSizes: ValidSizes[];
  onSizeChange: (size: ValidSizes) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChange,
}: Props) => {
  return (
    <div>
      <h3 className="mb-3 font-medium text-sm uppercase tracking-wide text-slate-500">
        Tallas disponibles
      </h3>

      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => {
          const isSelected = size === selectedSize;

          return (
            <button
              key={size}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSizeChange(size)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                {
                  "bg-primary border-primary text-white":
                    isSelected,
                  "bg-white border-slate-300 text-slate-700 hover:border-primary hover:text-primary":
                    !isSelected,
                }
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};