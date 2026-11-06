"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { contenedor } from "@/lib/estilos";

const opciones = [
  { href: "/dashboard", texto: "Inicio" },
  { href: "/dashboard/calificaciones", texto: "Calificaciones" },
  { href: "/dashboard/kardex", texto: "Kardex" },
  { href: "/dashboard/horario", texto: "Horario" },
  { href: "/dashboard/tutorias", texto: "Tutorías" },
];

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();

  async function salir() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-white/10 bg-noche text-white">
      <div className={`${contenedor} flex h-16 items-stretch gap-6 sm:gap-10`}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-oro font-display text-sm font-bold text-noche">
            IT
          </span>
          <span className="hidden font-display font-bold sm:inline">SII Celaya</span>
        </Link>
        <nav className="flex flex-1 gap-5 overflow-x-auto sm:gap-7">
          {opciones.map((op) => {
            const activo = pathname === op.href;
            return (
              <Link
                key={op.href}
                href={op.href}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center whitespace-nowrap border-b-2 text-sm ${
                  activo ? "border-oro font-medium text-white" : "border-transparent text-white/65 hover:text-white"
                }`}
              >
                {op.texto}
              </Link>
            );
          })}
        </nav>
        <button onClick={salir} className="text-sm text-white/65 hover:text-white">
          Salir
        </button>
      </div>
    </header>
  );
}
