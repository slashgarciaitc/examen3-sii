"use client";

import { useSii } from "@/lib/useSii";
import { Cargando, MensajeError } from "@/components/Estado";
import Encabezado from "@/components/Encabezado";
import { nombreMateria } from "@/lib/texto";
import { panel, contenedor } from "@/lib/estilos";

const DIAS = [
  ["lunes", "Lunes"],
  ["martes", "Martes"],
  ["miercoles", "Miércoles"],
  ["jueves", "Jueves"],
  ["viernes", "Viernes"],
  ["sabado", "Sábado"],
];

// un color apagado por materia
const COLORES = ["#1b396a", "#2e6a4c", "#7a4b8c", "#a35a1f", "#1f6f7a", "#8a6a12", "#9c3d5a"];

// "07:00-09:00" -> [7, 9]
function leerHoras(texto) {
  const m = texto?.match(/(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

function hora(h) {
  return `${String(h).padStart(2, "0")}:00`;
}

export default function HorarioPage() {
  const { datos, error, cargando } = useSii("horarios");
  const periodo = datos?.data?.[0];

  if (cargando || error || !periodo) {
    return (
      <>
        <Encabezado titulo="Horario" />
        <div className={`${contenedor} mt-10`}>
          {cargando ? <Cargando /> : <MensajeError texto={error || "No tienes horario en este periodo"} />}
        </div>
      </>
    );
  }

  const clases = periodo.horario.map((c, i) => ({ ...c, color: COLORES[i % COLORES.length] }));

  // juntar todas las horas para saber de qué hora a qué hora pintar la tabla
  const bloques = [];
  clases.forEach((c) => {
    DIAS.forEach(([dia]) => {
      const horas = leerHoras(c[dia]);
      if (horas) bloques.push({ dia, inicio: horas[0], fin: horas[1], clase: c, salon: c[`${dia}_clave_salon`] });
    });
  });

  const inicio = Math.min(...bloques.map((b) => b.inicio));
  const fin = Math.max(...bloques.map((b) => b.fin));
  const horas = bloques.length ? Array.from({ length: fin - inicio }, (_, i) => inicio + i) : [];
  const horasSemana = bloques.reduce((suma, b) => suma + b.fin - b.inicio, 0);

  return (
    <>
      <Encabezado
        titulo="Horario"
        detalle={`${periodo.periodo.descripcion_periodo}, ${clases.length} materias${
          horasSemana ? `, ${horasSemana} horas a la semana` : ""
        }`}
      />

      <div className={`${contenedor} mt-10`}>
        {bloques.length > 0 ? (
          <div className={`${panel} overflow-x-auto p-3 sm:p-4`}>
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <thead>
                <tr className="border-b border-linea">
                  <th className="w-16 py-3" />
                  {DIAS.map(([dia, nombre]) => (
                    <th key={dia} className="px-1 py-3 text-left text-xs font-medium text-gris">
                      {nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((h) => (
                  <tr key={h} className="border-b border-linea last:border-b-0">
                    <td className="py-2 pr-3 text-right align-top font-display text-sm tabular-nums text-gris">
                      {hora(h)}
                    </td>
                    {DIAS.map(([dia]) => {
                      const b = bloques.find((x) => x.dia === dia && h >= x.inicio && h < x.fin);
                      // si la clase empezó en una hora anterior, esa celda ya la ocupa el rowSpan
                      if (b && b.inicio !== h) return null;
                      const duracion = b ? b.fin - b.inicio : 1;
                      return (
                        <td key={dia} rowSpan={duracion} className="h-16 p-1 align-top">
                          {b && (
                            <div
                              className="rounded-md border-l-4 px-2.5 py-2 text-sm"
                              style={{
                                minHeight: `${duracion * 4 - 0.5}rem`,
                                borderColor: b.clase.color,
                                backgroundColor: `${b.clase.color}14`,
                              }}
                            >
                              <p className="font-semibold leading-snug" style={{ color: b.clase.color }}>
                                {nombreMateria(b.clase.nombre_materia)}
                              </p>
                              <p className="mt-0.5 text-gris">
                                {hora(b.inicio)} a {hora(b.fin)}
                                {b.salon && `, ${b.salon}`}
                              </p>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="max-w-prose rounded-md border-l-4 border-medio bg-white px-4 py-3 text-sm">
            El SII todavía no tiene horas ni salones registrados para tus materias de este periodo.
          </p>
        )}

        <h2 className="mt-14 font-display text-2xl font-bold">Materias inscritas</h2>
        <ul className={`${panel} mt-4 px-5 sm:px-6`}>
          {clases.map((c) => {
            const dias = DIAS.filter(([dia]) => c[dia]);
            return (
              <li
                key={c.id_grupo}
                className="grid gap-1 border-b border-linea py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-8"
              >
                <div className="flex gap-3">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="font-medium">{nombreMateria(c.nombre_materia)}</p>
                    <p className="text-sm text-gris">
                      {c.clave_materia}, grupo {c.letra_grupo}
                    </p>
                  </div>
                </div>
                <div className="pl-6 text-sm text-gris sm:pl-0 sm:text-right">
                  {dias.length === 0 && <p>Sin horas asignadas</p>}
                  {dias.map(([dia, nombre]) => (
                    <p key={dia}>
                      {nombre} {c[dia]}
                      {c[`${dia}_clave_salon`] && `, ${c[`${dia}_clave_salon`]}`}
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
