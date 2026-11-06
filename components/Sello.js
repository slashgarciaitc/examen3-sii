import { colorCalif } from "@/lib/colores";

// calificacion dentro de un circulo con doble aro, como sello de boleta
export default function Sello({ calif, chico }) {
  const tamano = chico ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  return (
    <span
      className={`sello inline-flex shrink-0 items-center justify-center rounded-full border-2 border-current bg-white font-display font-bold tabular-nums ${tamano} ${colorCalif(calif)}`}
    >
      {calif ?? "—"}
    </span>
  );
}
