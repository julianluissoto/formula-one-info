"use client";

import { Fold } from "@/components/fold";
import Link from "next/link";
import { useSyncExternalStore } from "react";

// Favoritos guardados en el navegador: rutas como "/pilotos/franco-colapinto".
const KEY = "favoritos";
const EVENT = "favoritos-cambio";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

let memory = "";
function read() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return memory;
  }
}

function useFavorites() {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return raw.split(",").filter(Boolean);
}

function toggle(href: string) {
  const now = read().split(",").filter(Boolean);
  memory = (now.includes(href) ? now.filter((x) => x !== href) : [...now, href]).join(",");
  try {
    localStorage.setItem(KEY, memory);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function FavButton({ href, name }: { href: string; name: string }) {
  const on = useFavorites().includes(href);
  return (
    <button type="button" aria-pressed={on} aria-label={`Favorito: ${name}`} onClick={() => toggle(href)} className={`cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors ${on ? "border-signal text-signal" : "border-line text-muted hover:text-ink"}`}>
      {on ? "★ En favoritos" : "☆ Agregar a favoritos"}
    </button>
  );
}

export function FavStar({ href }: { href: string }) {
  return useFavorites().includes(href) ? <span className="text-signal" role="img" aria-label="Favorito"> ★</span> : null;
}

export function Favorites({ items }: { items: { href: string; name: string; detail: string; color: string }[] }) {
  const favs = useFavorites();
  const mine = items.filter((x) => favs.includes(x.href));
  if (!mine.length) return null;
  return (
    <Fold id="favoritos" title="Tus favoritos" defaultOpen>
      <ul className="flex flex-wrap gap-3">
        {mine.map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="flex items-center gap-3 rounded-md bg-panel px-4 py-3 transition-colors hover:bg-panel-hover">
              <span aria-hidden className="h-9 w-1.5" style={{ background: x.color }} />
              <span><span className="block font-medium">{x.name}</span><span className="block text-sm text-muted">{x.detail}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </Fold>
  );
}
