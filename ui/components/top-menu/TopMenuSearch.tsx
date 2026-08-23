"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import clsx from "clsx";

const validatePaths = [
  "/",
  "/category/men",
  "/category/women",
  "/category/kid",
];

export const TopMenuSearch = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Foco automático al expandir
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Cerrar al hacer click fuera del formulario
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  const validatePath = (): string => {
    return validatePaths.includes(path) ? path : "/";
  };

  useEffect(() => {
    if (!validatePaths.includes(path)) return;
    if (!open) return;
    const timeOut = setTimeout(() => {
      const newParams = new URLSearchParams();
      newParams.append("search", inputRef.current?.value ?? "");
      router.push(`${validatePath()}?${newParams}`);
    }, 800);

    return () => clearTimeout(timeOut);
  }, [query, router, validatePath, open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") close();
    if (event.key === "Enter") {
      event.preventDefault();
      const newParams = new URLSearchParams();
      newParams.append("search", inputRef.current?.value ?? "");
      router.push(`${validatePath()}?${newParams}`);
    }
  };

  return (
    <form
      ref={formRef}
      role="search"
      className={clsx(
        "flex flex-row-reverse items-center transition-all duration-300 ease-out motion-reduce:transition-none",
        open
          ? "max-sm:flex-1 rounded-full border border-slate-300 bg-white pl-4 pr-1 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          : "rounded-md border border-transparent",
      )}
    >
      <button
        type="button"
        aria-label={open ? "Cerrar búsqueda" : "Buscar"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className="shrink-0 cursor-pointer p-2 rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-90 motion-reduce:transition-none"
      >
        {open ? (
          <IoCloseOutline className="w-5 h-5" />
        ) : (
          <IoSearchOutline className="w-5 h-5" />
        )}
      </button>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        className={clsx(
          "h-8 min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 transition-all duration-300 ease-out motion-reduce:transition-none",
          open ? "flex-1 opacity-100 sm:w-48 sm:flex-none" : "w-0 opacity-0",
        )}
      />
    </form>
  );
};
