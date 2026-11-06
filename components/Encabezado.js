import { contenedor } from "@/lib/estilos";

// franja azul con cuadricula milimetrica al inicio de cada pagina
export default function Encabezado({ titulo, detalle, children }) {
  return (
    <section className="cuadricula text-white">
      <div className={`${contenedor} pb-10 pt-10 sm:pb-12 sm:pt-14`}>
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{titulo}</h1>
        {detalle && <p className="mt-2 text-white/70">{detalle}</p>}
        {children}
      </div>
    </section>
  );
}
