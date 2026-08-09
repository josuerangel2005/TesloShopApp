import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function () {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-0">
      <div className="empty-card flex w-full max-w-md flex-col items-center rounded-2xl bg-white px-8 py-14 text-center shadow-sm ring-1 ring-slate-200">
        <div className="empty-float relative mb-8">
          <span className="absolute inset-0 -m-3 rounded-full bg-primary/5" />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IoCartOutline size={44} />
          </span>
        </div>

        <div className="empty-pop">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Aún no has agregado productos. Explora la tienda y encuentra
            prendas que se adapten a ti.
          </p>
        </div>

        <Link
          href="/"
          className="empty-pop btn-primary mt-8 inline-flex w-full justify-center text-center"
        >
          Regresar a la tienda
        </Link>
      </div>

      <style>{`
        .empty-card {
          animation: emptyFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .empty-float {
          animation: emptyFloat 3.5s ease-in-out infinite;
        }

        .empty-pop {
          animation: emptyFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
        }

        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        @keyframes emptyFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .empty-card,
          .empty-pop { animation: none; }
          .empty-float { animation: none; }
        }
      `}</style>
    </div>
  );
}