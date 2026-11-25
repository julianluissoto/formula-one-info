"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/escuderias", "Escuderías"],
  ["/pilotos", "Pilotos"],
  ["/circuitos", "Circuitos"],
  ["/monoplaza", "Monoplaza"],
  ["/campeonato", "Campeonato"],
  ["/comparar", "Comparar"],
  ["/campeones", "Campeones"],
  ["/guia", "Guía"],
  ["/buscar", "Buscar"],
];

const bar = "absolute left-3 h-0.5 w-5 bg-ink transition-transform motion-reduce:transition-none";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const press = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", press);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", press);
    };
  }, [open]);

  return (
    <div ref={root}>
      <button ref={button} type="button" aria-expanded={open} aria-controls="menu" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)} className="relative -mr-3 block size-11 cursor-pointer lg:hidden">
        <span className={`${bar} top-[15px] ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`${bar} top-[21px] ${open ? "scale-x-0" : ""}`} />
        <span className={`${bar} top-[27px] ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </button>
      <ul id="menu" className={`${open ? "block" : "hidden"} absolute inset-x-0 top-full z-20 max-h-[calc(100dvh-4rem)] overflow-y-auto border-y border-line bg-panel lg:static lg:flex lg:gap-4 lg:overflow-visible lg:border-0 lg:bg-transparent lg:text-sm`}>
        {links.map(([href, label]) => (
          <li key={href} className="border-t border-line first:border-0 lg:border-0">
            <Link href={href} onClick={() => setOpen(false)} aria-current={path.startsWith(href) ? "page" : undefined} className="wide block border-l-4 border-transparent px-5 py-3.5 hover:bg-panel-hover aria-[current]:border-race aria-[current]:font-bold lg:border-b-2 lg:border-l-0 lg:px-0 lg:py-5 lg:[font-stretch:100%] lg:hover:border-race lg:hover:bg-transparent">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
