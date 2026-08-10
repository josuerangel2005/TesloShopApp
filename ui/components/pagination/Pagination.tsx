"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  take: number;
  totalElements: number;
}

export const Pagination = ({ take, totalElements }: Props) => {
  const totalPages = Math.ceil(totalElements / take);
  const pagesNumbers = Array.from({ length: totalPages }, (_, i) => i);

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageSelected = +(searchParams.get("page") || 1);

  const handleChangePage = (newPage: number): void => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());

    router.push(`${pathName}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-2 p-6"
    >
      <button
        aria-label="Página anterior"
        className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-slate-500"
        onClick={() => handleChangePage(pageSelected - 1)}
        disabled={pageSelected === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {pagesNumbers.map((i) => (
        <button
          onClick={() => handleChangePage(i + 1)}
          key={i}
          aria-current={i + 1 === pageSelected ? "page" : undefined}
          aria-label={`Ir a la página ${i + 1}`}
          className={clsx(
            "flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
            {
              "bg-slate-900 text-white shadow-sm": i + 1 === pageSelected,
              "bg-white text-slate-600 hover:bg-gray-100 hover:text-slate-900":
                i + 1 !== pageSelected,
            },
          )}
        >
          {i + 1}
        </button>
      ))}

      <button
        aria-label="Página siguiente"
        className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-slate-500"
        onClick={() => handleChangePage(pageSelected + 1)}
        disabled={pageSelected === totalPages}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
};
