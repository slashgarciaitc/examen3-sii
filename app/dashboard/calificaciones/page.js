"use client";

import { useState } from "react";
import { useSii } from "@/lib/useSii";
import { colorCalif } from "@/lib/colores";
import { campo, th, td, panel, contenedor } from "@/lib/estilos";
import { Cargando, MensajeError } from "@/components/Estado";
import Encabezado from "@/components/Encabezado";
import Sello from "@/components/Sello";
import { nombreMateria } from "@/lib/texto";

// minusculas y sin acentos para que "topicos" encuentre "TÓPICOS"
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function CalificacionesPage() {
  const { datos, error, cargando } = useSii("calificaciones");
  const [busqueda, setBusqueda] = useState("");

  // se aplana periodo -> materias en una sola lista
  const filas = [];
  (datos?.data || []).forEach((p) => {
    p.materias.forEach((m) => {
      // el sii manda el campo como "calificaiones"
      const parciales = m.calificaiones || [];
      const capturadas = parciales.filter((c) => c.calificacion !== null).map((c) => Number(c.calificacion));
      const promedio = capturadas.length ? Math.round(capturadas.reduce((a, b) => a + b, 0) / capturadas.length) : null;
      filas.push({ ...m.materia, periodo: p.periodo.descripcion_periodo, parciales, promedio });
    });
  });

  const texto = normalizar(busqueda);
  const visibles = filas.filter(
    (f) => normalizar(f.nombre_materia).includes(texto) || normalizar(f.periodo).includes(texto),
  );
  const numParciales = Math.max(0, ...filas.map((f) => f.parciales.length));
  const periodos = [...new Set(filas.map((f) => f.periodo))];

  let contenido;
  if (cargando) contenido = <Cargando />;
  else if (error) contenido = <MensajeError texto={error} />;
  else
    contenido = (
      <>
        <input
          type="search"
          aria-label="Buscar por materia o periodo"
          placeholder="Buscar por materia o periodo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={`${campo} max-w-sm`}
        />

        <div className={`${panel} mt-6 overflow-x-auto px-5 sm:px-6`}>
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-linea">
              <tr>
                <th className={th}>Materia</th>
                <th className={th}>Periodo</th>
                {Array.from({ length: numParciales }, (_, i) => (
                  <th key={i} className={`${th} text-right`}>
                    Parcial {i + 1}
                  </th>
                ))}
                <th className={`${th} pr-0 text-right`}>Final</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((f) => (
                <tr key={f.id_grupo} className="border-b border-linea last:border-b-0">
                  <td className={`${td} py-4`}>
                    <p className="font-medium">{nombreMateria(f.nombre_materia)}</p>
                    <p className="text-sm text-gris">
                      {f.clave_materia}, grupo {f.letra_grupo}
                    </p>
                  </td>
                  <td className={`${td} whitespace-nowrap py-4 text-sm text-gris`}>{f.periodo}</td>
                  {Array.from({ length: numParciales }, (_, i) => {
                    const c = f.parciales[i]?.calificacion ?? null;
                    return (
                      <td key={i} className={`${td} py-4 text-right font-medium tabular-nums ${colorCalif(c)}`}>
                        {c ?? "—"}
                      </td>
                    );
                  })}
                  <td className={`${td} py-3 pr-0 text-right`}>
                    <Sello calif={f.promedio} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibles.length === 0 && <p className="py-8 text-gris">Ninguna materia coincide con la búsqueda.</p>}
        </div>

        <p className="mt-4 text-sm text-gris">La calificación final es el promedio de los parciales ya capturados.</p>
      </>
    );

  return (
    <>
      <Encabezado titulo="Calificaciones" detalle={periodos.join(", ") || "Periodo actual"} />
      <div className={`${contenedor} mt-10`}>{contenido}</div>
    </>
  );
}
