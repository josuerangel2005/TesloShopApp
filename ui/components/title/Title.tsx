import { titleFont } from "@/config/fonts";

interface Props {
  title: string;
  subTitle?: string;
  className?: string;
}

export const Title = ({ title, subTitle, className }: Props) => {
  return (
    <div className={`${className} mt-3 title-reveal`}>
      <div className="flex items-center gap-3 my-10">
        <span className="h-8 w-1 rounded-full bg-primary" aria-hidden />
        <h1
          className={`${titleFont.className} antialiased text-4xl font-semibold text-slate-800`}
        >
          {title}
        </h1>
      </div>

      {subTitle && (
        <h3 className="text-xl mb-5 text-slate-500 title-reveal-sub">
          {subTitle}
        </h3>
      )}

      <style>{`
        .title-reveal {
          animation: titleReveal 0.5s ease-out both;
        }
        .title-reveal-sub {
          animation: titleReveal 0.5s ease-out 0.12s both;
        }
        @keyframes titleReveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .title-reveal, .title-reveal-sub {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
