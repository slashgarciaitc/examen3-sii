"use client";

import { useSii } from "@/lib/useSii";
import { Cargando, MensajeError } from "@/components/Estado";
import Encabezado from "@/components/Encabezado";
import Trayectoria from "@/components/Trayectoria";
import { nombrePropio } from "@/lib/texto";
import { contenedor, panel } from "@/lib/estilos";

function Dato({ titulo, children }) {
  return (
    <div className="sm:border-l sm:border-white/15 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
      <dt className="text-sm text-white/60">{titulo}</dt>
      <dd className="mt-1 font-display text-3xl font-bold tabular-nums sm:text-4xl">{children}</dd>
    </div>
  );
}

function Muestra({ color, texto }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-[2px] ${color}`} />
      {texto}
    </span>
  );
}

export default function InicioPage() {
  const perfil = useSii("perfil");
  const kardex = useSii("kardex");

  if (perfil.cargando || kardex.cargando) {
    return (
      <div className={`${contenedor} pt-12`}>
        <Cargando />
      </div>
    );
  }
  if (perfil.error) {
    return (
      <div className={`${contenedor} pt-12`}>
        <MensajeError texto={perfil.error} />
      </div>
    );
  }

  const p = perfil.datos.data;
  const materias = kardex.datos?.data?.kardex || [];
  const avance = Number(p.porcentaje_avance);

  return (
    <>
      <Encabezado
        titulo={nombrePropio(p.persona)}
        detalle={`No. de control ${p.numero_control}, semestre ${p.semestre}`}
      >
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          <Dato titulo="Promedio ponderado">
            <span className="text-oro">{Number(p.promedio_ponderado).toFixed(2)}</span>
          </Dato>
          <Dato titulo="Créditos acumulados">{p.creditos_acumulados}</Dato>
          <Dato titulo="Materias aprobadas">
            {p.materias_aprobadas}
            <span className="ml-1.5 font-sans text-base font-normal text-white/60">de {p.materias_cursadas}</span>
          </Dato>
          <Dato titulo="Avance de la carrera">
            {avance}%
            <div className="mt-3 h-1.5 rounded-full bg-white/15">
              <div className="h-full rounded-full bg-oro" style={{ width: `${avance}%` }} />
            </div>
          </Dato>
        </dl>
      </Encabezado>

      <div className={`${contenedor} mt-10`}>
        <section className={`${panel} p-5 sm:p-8`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <h2 className="font-display text-2xl font-bold">Trayectoria</h2>
            <div className="flex gap-4 text-sm text-gris">
              <Muestra color="bg-alto" texto="85 o más" />
              <Muestra color="bg-medio" texto="70 a 84" />
              <Muestra color="bg-bajo" texto="No acreditada" />
            </div>
          </div>
          <p className="mt-1 max-w-prose text-sm text-gris">
            Cada barra es una materia de tu kardex, acomodada por semestre. Pasa el cursor o toca una barra para ver el
            detalle y, si la repetiste, todos tus intentos.
          </p>

          <div className="mt-10">
            {kardex.error ? <MensajeError texto={kardex.error} /> : <Trayectoria kardex={materias} />}
          </div>
        </section>
      </div>
    </>
  );
}
