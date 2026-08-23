import { IoSyncOutline } from "react-icons/io5";

interface Props {
  entity: string;
}

export const Fallback = ({ entity }: Props) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <IoSyncOutline
        aria-hidden
        className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none"
      />

      <p className="text-sm font-medium text-slate-500">Cargando {entity}...</p>

      {/* Barra de progreso indeterminada */}
      <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/3 rounded-full bg-primary/70 [animation:slide_1.2s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [animation\\:slide_1\\.2s_ease-in-out_infinite] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
