// pantalla de login dividida: franja con cuadricula y el formulario a un lado
export default function PantallaAcceso({ lema, detalle, children }) {
  return (
    <main className="flex flex-1 flex-col md:flex-row">
      <section className="cuadricula flex flex-col justify-between px-6 py-8 text-white sm:px-12 md:w-[46%] md:py-12">
        <p className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-oro font-display text-sm font-bold text-noche">
            IT
          </span>
          <span className="font-display font-bold">SII Celaya</span>
        </p>
        <div className="py-12 md:py-0">
          <p className="max-w-md font-display text-4xl font-bold leading-[1.1] sm:text-5xl">{lema}</p>
          <div className="mt-6 h-1 w-16 bg-oro" />
          <p className="mt-6 max-w-sm text-white/70">{detalle}</p>
        </div>
        <p className="hidden text-sm text-white/55 md:block">Instituto Tecnológico de Celaya</p>
      </section>

      <section className="flex flex-1 items-center bg-white px-6 py-12 sm:px-12 md:px-16">{children}</section>
    </main>
  );
}
