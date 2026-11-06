"use client";

import { useSii } from "@/lib/useSii";
import { th, td, panel, contenedor } from "@/lib/estilos";
import { Cargando, MensajeError } from "@/components/Estado";
import Encabezado from "@/components/Encabezado";
import Sello from "@/components/Sello";
import { nombreMateria } from "@/lib/texto";

function tipoCurso(descripcion) {
  if (descripcion.includes("ORDINARIO")) return "Ordinario";
  const t = descripcion.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export default function KardexPage() {
  const { datos, error, cargando } = useSii("kardex");

  if (cargando || error) {
    return (
      <>
        <Encabezado titulo="Kardex" />
        <div className={`${contenedor} mt-10`}>{cargando ? <Cargando /> : <MensajeError texto={error} />}</div>
      </>
    );
  }

  const { porcentaje_avance, kardex } = datos.data;

  const porSemestre = {};
  kardex.forEach((m) => {
    if (!porSemestre[m.semestre]) porSemestre[m.semestre] = [];
    porSemestre[m.semestre].push(m);
  });

  const aprobadas = kardex.filter((m) => Number(m.calificacion) >= 70);
  const creditos = aprobadas.reduce((suma, m) => suma + Number(m.creditos), 0);

  return (
    <>
      <Encabezado
        titulo="Kardex"
        detalle={`${aprobadas.length} materias acreditadas de ${kardex.length} registros, ${creditos} créditos.`}
      >
        <div className="mt-8 max-w-xl">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-white/60">Avance de la carrera</span>
            <span className="font-display text-xl font-bold tabular-nums">{porcentaje_avance}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/15">
            <div className="h-full rounded-full bg-oro" style={{ width: `${porcentaje_avance}%` }} />
          </div>
        </div>
      </Encabezado>

      <div className={`${contenedor} mt-10 space-y-8`}>
        {Object.keys(porSemestre).map((sem) => {
          const materias = porSemestre[sem];
          const creditosSem = materias
            .filter((m) => Number(m.calificacion) >= 70)
            .reduce((suma, m) => suma + Number(m.creditos), 0);
          return (
            <section key={sem} className="grid gap-3 md:grid-cols-[8rem_1fr] md:gap-6">
              <div className="flex items-baseline gap-3 md:block md:pt-4">
                <p className="text-sm text-gris">Semestre</p>
                <p className="font-display text-4xl font-bold leading-none text-azul md:mt-1 md:text-6xl">{sem}</p>
                <p className="text-sm text-gris md:mt-2">{creditosSem} créditos</p>
              </div>
              <div className={`${panel} overflow-x-auto px-5 sm:px-6`}>
                <table className="w-full min-w-[620px] table-fixed">
                  <thead className="border-b border-linea">
                    <tr>
                      <th className={th}>Materia</th>
                      <th className={`${th} w-20`}>Periodo</th>
                      <th className={`${th} w-32`}>Tipo</th>
                      <th className={`${th} w-20 text-right`}>Créditos</th>
                      <th className={`${th} w-24 pr-0 text-right`}>Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.map((m) => (
                      <tr key={m.clave_materia + m.periodo} className="border-b border-linea last:border-b-0">
                        <td className={td}>
                          <p className="font-medium">{nombreMateria(m.nombre_materia)}</p>
                          <p className="text-sm text-gris">{m.clave_materia}</p>
                        </td>
                        <td className={`${td} text-sm tabular-nums text-gris`}>{m.periodo}</td>
                        <td className={`${td} text-sm text-gris`}>{tipoCurso(m.descripcion)}</td>
                        <td className={`${td} text-right text-sm tabular-nums text-gris`}>{m.creditos}</td>
                        <td className={`${td} py-2 pr-0 text-right`}>
                          <Sello calif={m.calificacion} chico />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
